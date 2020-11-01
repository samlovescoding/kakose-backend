const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { compareSync, hashSync } = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { success, error, caughtError, serveSuccess } = require("../utility/jsonio");

const member = require("../models/member"); // This is supposed to be a mongoose model.
const upload = require("../middlewares/upload");

// POST /login - This handle member login
router.post("/login", [body("email").isEmail(), body("password").exists()], (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return error(res, errors.array());
  }

  const email = req.body.email;
  const password = req.body.password;
  member
    .findOne({
      email: email,
    })
    .exec()
    .then((testMember) => {
      if (testMember) {
        if (compareSync(password, testMember.password)) {
          testMember.password = undefined;
          let token = jwt.sign(
            {
              id: testMember._id,
              role: testMember.role,
              name: testMember.name,
              email: testMember.email,
              type: "member",
            },
            process.env.JWT_SECRET
          );
          return success(res, {
            token,
            name: testMember.name,
            email: testMember.email,
            role: testMember.role,
          });
        } else {
          return error(res, "Incorrect password!");
        }
      } else {
        return error(res, "Email was not found!");
      }
    })
    .catch(caughtError);
});

// PUT /register - This handle member registration
router.put(
  "/register",
  upload.single("profilePhoto"),
  [
    body("email").isEmail(),
    body("password").exists(),
    body("name").exists(),
    body("sex").exists(),
    body("address").exists(),
    body("postalCode").exists(),
    body("phoneNumber").exists(),
    body("memberType").exists(),
    body("dateOfBirth").exists(),
    body("memberSince").exists(),
  ],

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, errors.array());
    }

    const newMember = new member({
      ...req.body,
      _id: mongoose.Types.ObjectId(),
      password: hashSync(req.body.password, 10),
      profilePhoto: req.file,
    });

    return newMember
      .save()
      .then((result) => {
        result.password = undefined;
        success(res, result);
      })
      .catch(caughtError(res));
  }
);

// PUT /:id - This will perform any updates to the member
router.patch("/:id", (req, res, next) => {
  member
    .findOneAndUpdate(
      {
        _id: req.params.id,
        ...req.body.filters,
      },
      req.body
    )
    .exec()
    .then((result) => {
      return success(res, {
        message: "Member was updated.",
      });
    })
    .catch(caughtError(res));
});

// DELETE /:id - This will delete a member.
router.delete("/:id", (req, res, next) => {
  member
    .deleteOne({
      _id: req.params.id,
      ...req.body.filters,
    })
    .exec()
    .then(serveSuccess(res))
    .catch(caughtError(res));
});

// GET / - Lists all members
router.get("/", (req, res, next) => {
  member
    .find(req.body.filters)
    .select("_id name email profilePhoto memberType")
    .exec()
    .then((members) => {
      success(res, members);
    })
    .catch(caughtError(res));
});

// GET /:id - Display full information about a member
router.get("/:id", (req, res, next) => {
  member
    .findOne({
      _id: req.params.id,
      ...req.body.filters,
    })
    .select("-password")
    .exec()
    .then(serveSuccess(res))
    .catch(caughtError(res));
});

module.exports = router;

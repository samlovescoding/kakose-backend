const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { compareSync, hashSync } = require("bcrypt");
const { body, validationResult } = require("express-validator");
const {
  success,
  error,
  caughtError,
  serveSuccess,
} = require("../utility/jsonio");

const user = require("../models/user"); // This is supposed to be a mongoose model.

// POST /login - This handle user login
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return error(res, errors.array());
    }

    const email = req.body.email;
    const password = req.body.password;
    user
      .findOne({
        email: email,
      })
      .exec()
      .then((testUser) => {
        if (testUser) {
          if (compareSync(password, testUser.password)) {
            testUser.password = undefined;
            let token = jwt.sign(
              {
                id: testUser._id,
                role: testUser.role,
                name: testUser.name,
                email: testUser.email,
                type: "user",
              },
              process.env.JWT_SECRET
            );
            return success(res, {
              token,
              name: testUser.name,
              email: testUser.email,
              role: testUser.role,
            });
          } else {
            return error(res, "Incorrect password!");
          }
        } else {
          return error(res, "Email was not found!");
        }
      })
      .catch(caughtError);
  }
);

// PUT /register - This handle user registration
router.put(
  "/register",
  [body("name").exists(), body("email").isEmail(), body("password").exists()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, errors.array());
    }

    const newUser = new user({
      ...req.body,
      _id: mongoose.Types.ObjectId(),
      password: hashSync(req.body.password, 10),
    });
    return newUser
      .save()
      .then((result) => {
        result.password = undefined;
        success(res, result);
      })
      .catch(caughtError(res));
  }
);

// PATCH /:id - This will perform any updates to the user
router.patch("/:id", (req, res, next) => {
  user
    .findOneAndUpdate(
      {
        _id: req.params.id,
        ...req.body.filters,
      },
      req.body
    )
    .exec()
    .then((result) => {
      success(res, {
        message: "User was updated.",
      });
    })
    .catch(caughtError(res));
});

// DELETE /:id - This will delete a user.
router.delete("/:id", (req, res, next) => {
  user
    .deleteOne({
      _id: req.params.id,
      ...req.body.filters,
    })
    .exec()
    .then(serveSuccess(res))
    .catch(caughtError(res));
});

// GET / - Lists all users
router.get("/", (req, res, next) => {
  user
    .find(req.body.filters)
    .select("_id name email role")
    .exec()
    .then((users) => {
      success(res, users);
    })
    .catch(caughtError(res));
});

// GET /:id - Display full information about a user
router.get("/:id", (req, res, next) => {
  user
    .findOne({
      _id: req.params.id,
      ...req.body.filters,
    })
    .select("_id name role email")
    .exec()
    .then(serveSuccess(res))
    .catch(caughtError(res));
});

module.exports = router;

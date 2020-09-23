const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { success, caughtError, serveSuccess } = require("../utility/jsonio");

const user = require("../models/user"); // This is supposed to be a mongoose model.

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
    .exec()
    .then(serveSuccess(res))
    .catch(caughtError(res));
});

// POST / - This will create a new user
router.post("/", (req, res, next) => {
  let instance = new user({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
  });
  instance.save().then(serveSuccess(res)).catch(caughtError(res));
});

// PUT /:id - This will perform any updates to the user
router.put("/:id", (req, res, next) => {
  user
    .findOneAndUpdate(
      {
        _id: req.params.id,
        ...req.body.filters,
      },
      req.body
    )
    .exec()
    .then(serveSuccess(res))
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

module.exports = router;

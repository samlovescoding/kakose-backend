const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { success, caughtError, serveSuccess } = require("../utility/jsonio");

const configuration = require("../models/configuration"); // This is supposed to be a mongoose model.

// GET / - Lists all configurations
router.get("/", (req, res, next) => {
  success(res, req.config);

  // No database interaction is needed now
  //
  // configuration
  //   .find(req.body.filters)
  //   .select("_id key value type")
  //   .exec()
  //   .then((configurations) => {
  //     success(res, configurations);
  //   })
  //   .catch(caughtError(res));
});

// GET /:type - Display full information about a configuration
router.get("/:type", (req, res, next) => {
  configuration
    .find({
      type: req.params.type,
      ...req.body.filters,
    })
    .select("_id key value type")
    .exec()
    .then(serveSuccess(res))
    .catch(caughtError(res));
});

// POST / - This will create a new configuration
router.post("/", (req, res, next) => {
  let instance = new configuration({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
  });
  instance.save().then(serveSuccess(res)).catch(caughtError(res));
});

// PATCH /:key - This will perform any updates to the configuration
router.patch("/:key", (req, res, next) => {
  configuration
    .findOneAndUpdate(
      {
        key: req.params.key,
        ...req.body.filters,
      },
      req.body
    )
    .exec()
    .then((result) => {
      success(res, {
        message: "Settings was updated!",
      });
    })
    .catch(caughtError(res));
});

// DELETE /:id - This will delete a configuration.
router.delete("/:key", (req, res, next) => {
  configuration
    .deleteOne({
      key: req.params.key,
      ...req.body.filters,
    })
    .exec()
    .then((result) => {
      success(res, {
        message: "Configuration was deleted!",
      });
    })
    .catch(caughtError(res));
});

module.exports = router;

const router = require("express").Router();
const Club = require("../models/club");
const mongoose = require("mongoose");
const { success, error } = require("../utility/jsonio");

router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();
    success(res, clubs);
  } catch (e) {
    error(res, e);
  }
});

router.post("/", async (req, res) => {
  try {
    const club = await Club.create({
      _id: mongoose.Types.ObjectId(),
      ...req.body,
    });
    success(res, {
      message: "Club was created",
    });
  } catch (e) {
    error(res, e);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const club = await Club.findOneAndUpdate({ _id: req.params.id }, { ...req.body });
    success(res, {
      message: "Club updated",
    });
  } catch (e) {
    error(res, e);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    await Club.deleteOne({ ...req.body });
    const result = {
      message: "Club Delete",
    };
    success(res, result);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

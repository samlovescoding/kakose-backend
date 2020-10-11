const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { success, error } = require("../utility/jsonio");
const memberAuth = require("../middlewares/memberAuth");
const booking = require("../models/booking"); // This is supposed to be a mongoose model.
const { body } = require("express-validator");

router.get("/", async (req, res, next) => {
  try {
    let result = await booking.find({ ...req.body.filters });
    success(res, result);
  } catch (e) {
    error(res, e);
  }
});

// POST / - Create a new booking
router.post("/", memberAuth, [body("timing")], async (req, res, next) => {
  try {
    let newBooking = new booking({
      _id: mongoose.Types.ObjectId(),
      timing: Date.parse(req.body.timing),
      memberBookedBy: req.user.id,
    });
    let result = await newBooking.save();
    success(res, result);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

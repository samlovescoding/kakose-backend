const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { success, error } = require("../utility/jsonio");
const memberAuth = require("../middlewares/memberAuth");
const booking = require("../models/booking"); // This is supposed to be a mongoose model.
const { body } = require("express-validator");
const randomDate = require("../utility/randomDate");

router.get("/", [body("date")], async (req, res, next) => {
  try {
    let date = new Date(req.body.date);
    let dateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
    let dateEnd = new Date(new Date().setDate(dateStart.getDate() + 1));

    // Find all the bookings in between the given date
    let result = await booking.find({
      timing: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      ...req.body.filters,
    });
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

router.post("/ballot", memberAuth, [body("date")], async (req, res, next) => {
  let date = new Date(req.body.date);

  let bookingTime = randomDate(date);
  try {
    let isValid = false;
    while (isValid === false) {}
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

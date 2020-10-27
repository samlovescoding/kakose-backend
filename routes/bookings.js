const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { success, error } = require("../utility/jsonio");
const onlyUsers = require("../middlewares/onlyUsers");
const booking = require("../models/booking"); // This is supposed to be a mongoose model.
const { body } = require("express-validator");
const randomDate = require("../utility/randomDate");

router.get("/", [body("date")], async (req, res) => {
  try {
    let date = new Date(req.body.date);
    let dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
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

router.get("/timed", [body("date")], async (req, res) => {
  try {
    console.log("You are requesting timed booking. This is a heavily looped route and must be handled client-side.");

    let date = new Date(req.body.date);
    let dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(new Date().setDate(dateStart.getDate() + 1));

    // Find all the bookings in between the given date
    let bookings = await booking.find({
      timing: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      ...req.body.filters,
    });

    let result = {};

    let currentMinutes = req.config.club_opening_time;
    while (currentMinutes < req.config.club_closing_time) {
      result[currentMinutes] = [];
      let thenMinutes = currentMinutes + req.config.tee_time_length;
      let currentHours = Math.floor(currentMinutes / 60);
      let currentMin = currentMinutes % 60;
      let thenHours = Math.floor(thenMinutes / 60);
      let thenMin = thenMinutes % 60;

      let from = new Date(date.getFullYear(), date.getMonth(), date.getDate(), currentHours, currentMin, 0, 0);
      let to = new Date(date.getFullYear(), date.getMonth(), date.getDate(), thenHours, thenMin, 0, 0);

      bookings.forEach((slot) => {
        slotTiming = new Date(slot.timing);
        if (slotTiming.getTime() >= from.getTime() && slotTiming.getTime() <= to.getTime()) {
          result[currentMinutes].push(slot);
        }
      });

      filteredResult = Object.keys(result).reduce((filtered, key) => {
        if (result[key].length !== 0) {
          filtered[key] = result[key];
        }
        return filtered;
      }, {});

      currentMinutes += req.config.tee_time_length;
    }

    success(res, filteredResult);
  } catch (e) {
    error(res, e);
  }
});

// POST / - Create a new booking
router.post("/", onlyUsers, [body("timing")], async (req, res) => {
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

// POST /ballot - Create a new booking via ballot
router.post("/ballot", onlyUsers, [body("date")], async (req, res) => {
  let date = new Date(req.body.date);
  let bookingTime = randomDate(date);
  try {
    let isValid = false;
    while (isValid === false) {
      // This will go into an infinite loop rn.
    }
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

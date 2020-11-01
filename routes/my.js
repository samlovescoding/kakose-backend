const express = require("express");
const router = express.Router();
const onlyMembers = require("../middlewares/onlyMembers");
const { success, error } = require("../utility/jsonio");

const Member = require("../models/member");
const Booking = require("../models/booking");

router.get("/bookings", onlyMembers, async (req, res) => {
  try {
    const bookings = await Bookings.find({
      memberBookedBy: req.member,
      ...req.query.filters,
    });
    success(res, bookings);
  } catch (e) {
    error(res, e);
  }
});

router.get("/", onlyMembers, async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.member,
    });
    success(res, member);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

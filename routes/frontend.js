const router = require("express").Router();

// Utility
const { success, error } = require("../utility/jsonio");

// Middlewares
const memberAuth = require("../middlewares/memberAuth");

// Models
const TeeSheet = require("../models/teeSheet");
const Product = require("../models/product");
const Club = require("../models/club");
const Member = require("../models/member");
const MemberType = require("../models/memberType");
const Order = require("../models/order");

router.get("/club", memberAuth, async (req, res) => {
  try {
    let club = await Club.findOne({
      _id: req.club,
    });
    success(res, club);
  } catch (e) {
    error(res, e);
  }
});

router.get("/sheets", memberAuth, async (req, res) => {
  try {
    let { from, to } = req.query;
    let queryModifier = {};
    if (from && to) {
      queryModifier = {
        stamp: {
          $gte: from,
          $lte: to,
        },
      };
    }

    let sheets = await TeeSheet.find({
      club: req.club,
      ...queryModifier,
    })
      .select("stamp template ballot sheetType ")
      .populate({
        path: "template",
        select: "name",
      });
    success(res, sheets);
  } catch (e) {
    error(res, e);
  }
});

router.get("/sheet/:stamp", memberAuth, async (req, res) => {
  try {
    let sheet = await TeeSheet.findOne({
      stamp: req.params.stamp,
      club: req.club,
    }).populate({
      path: "slots.bookings.member",
      select: "name email profilePhoto",
      ref: "members",
    });
    success(res, sheet);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

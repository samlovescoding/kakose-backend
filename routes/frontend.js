const router = require("express").Router();
const mongoose = require("mongoose");
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

router.get("/bookings", memberAuth, async (req, res) => {
  try {
    let slots = [];
    let ballotEntries = [];

    // let teeSheets = await TeeSheet.find({
    //   club: req.club,
    // }).populate("slots.bookings.member");

    let queryModifier = {};

    if (req.body.from) {
      queryModifier = {
        stamp: {
          $gte: req.body.from,
        },
      };
    } else if (req.body.to) {
      queryModifier = {
        stamp: {
          $lte: req.body.from,
        },
      };
    } else if (req.body.from && req.body.to) {
      queryModifier = {
        stamp: {
          $gte: req.body.from,
          $lte: req.body.to,
        },
      };
    }

    if (req.body.on) {
      queryModifier = {
        stamp: req.body.on,
      };
    }

    let teeSheets = await TeeSheet.find({
      club: req.club,
      ...queryModifier,
    }).populate({
      path: "slots.bookings.member",
      select: "name email profilePhoto",
    });

    teeSheets.forEach((sheet) => {
      sheet.slots.forEach((slot) => {
        slot.bookings.forEach((booking) => {
          if (booking.member._id == req.member.id) {
            console.log(slot);
            slots.push({ ...slot.toObject() });
            //console.log(Object.keys(slot.toObject()));
          }
        });
      });
      sheet.ballotEntries.forEach((entry) => {
        ballotEntries.push(entry);
      });
    });

    success(res, {
      slots,
      ballot: ballotEntries,
    });
  } catch (e) {
    error(res, e);
  }
});

router.post("/book/:stamp/:slot", memberAuth, async (req, res) => {
  try {
    const teeSheet = await TeeSheet.findOne({
      club: req.club,
      stamp: req.params.stamp,
    });
    let blankEntry = { member: req.member.id, type: "locked" };
    if (!teeSheet) {
      throw new Error("Could not find a tee sheet!");
    }
    if (teeSheet.ballot === true) {
      teeSheet.ballotEntries.push(blankEntry);
    } else {
      let foundSlot = false;
      teeSheet.slots.forEach((slot, index) => {
        if (slot.code == req.params.slot) {
          foundSlot = true;
          if (slot.available > 0) {
            teeSheet.slots[index].available = teeSheet.slots[index].available - 1;
            teeSheet.slots[index].bookings.push(blankEntry);
          } else {
            throw new Error("Time slot is already full! Please select a different time slot.");
          }
        }
      });
      if (!foundSlot) {
        throw new Error("Could not find the slot!");
      }
    }
    await teeSheet.save();
    success(res, {
      message: "Booking successful.",
    });
  } catch (e) {
    error(res, e);
  }
});

router.get("/shop", memberAuth, async (req, res) => {
  try {
    const products = await Product.find({
      club: req.club,
    });
    success(res, products);
  } catch (e) {
    error(res, e);
  }
});

router.get("/members", memberAuth, async (req, res) => {
  try {
    const members = await Member.find({
      club: req.member.club,
    })
      .select("-password")
      .limit(20);
    success(res, members);
  } catch (e) {
    error(res, e);
  }
});

router.get("/search", memberAuth, async (req, res) => {
  try {
    console.log(req.query);
    const members = await Member.find({ $text: { $search: req.query.query }, club: req.member.club }).select("-password");
    success(res, members);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

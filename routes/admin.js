const router = require("express").Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// IO Imports
const { success, error } = require("../utility/jsonio");

// Model Imports
const Booking = require("../models/booking");
const Club = require("../models/club");
const Member = require("../models/member");
const MemberType = require("../models/memberType");
const TeeSheet = require("../models/teeSheet");
const Product = require("../models/product");
const User = require("../models/user");

// Middleware imports
const onlyUsers = require("../middlewares/onlyUsers");
const onlyMembers = require("../middlewares/onlyMembers");
const upload = require("../middlewares/upload");

// Utility Imports
const { compareSync, hashSync } = require("bcrypt");

router.get("/members", onlyUsers, async (req, res) => {
  try {
    const members = await Member.find({
      "membership.club": req.user.club,
    })
      .select("-password -dateOfBirth -memberSince -updatedAt -createdAt")
      .populate({
        path: "membership.type",
      });
    success(
      res,
      members.map((member) => {
        member["profilePhoto"] =
          process.env.URL + "uploads/" + member.profilePhoto.filename;
        return member;
      })
    );
  } catch (e) {
    error(res, e);
  }
});

router.patch(
  "/member-photo/:id",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const member = await Member.findOneAndUpdate(
        { _id: req.params.id },
        {
          profilePhoto: req.file,
        }
      );
      console.log(__dirname, "uploads", member.profilePhoto.fileName);
      const oldFilePath = path.join(
        __dirname,
        "../uploads",
        member.profilePhoto.filename
      );
      console.log(oldFilePath);
      fs.unlinkSync(oldFilePath);
      success(res, {
        message: "Photo was updated",
      });
    } catch (e) {
      error(res, e);
    }
  }
);

router.patch("/update-membership/:id/:membershipId", async (req, res) => {
  try {
    const { id: _id, membershipId } = req.params;
    let member = await Member.findOne({ _id });
    member.membership = member.membership.map((_) => {
      if (_._id == membershipId) {
        console.log({ ..._.toObject(), ...req.body });
        return { ..._.toObject(), ...req.body };
      }
      return _;
    });
    await member.save();

    success(res, { message: "Updated membership" });
  } catch (e) {
    error(res, e);
  }
});

router.get("/products", onlyUsers, async (req, res, next) => {
  try {
    const products = await Product.find({
      club: req.user.club,
    });
    success(res, products);
  } catch (e) {
    error(res, e);
  }
});

router.get("/product-types", onlyUsers, async (req, res) => {
  try {
    const categories = await Product.find({ club: req.user.club })
      .select("category")
      .distinct("category");
    success(res, categories);
  } catch (e) {
    error(res, e);
  }
});

router.get("/profile", onlyUsers, async (req, res) => {
  try {
    success(res, req.user);
  } catch (e) {
    error(res, e);
  }
});

router.patch("/update-profile", onlyUsers, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { ...req.body }
    );
    success(res, {
      message: "User Profile was updated",
    });
  } catch (e) {
    error(res, e);
  }
});

router.patch("/update-password", onlyUsers, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (confirmPassword !== newPassword) {
      return error(
        res,
        {
          message: "Confirm password dont match the new password.",
        },
        401
      );
    }

    if (!compareSync(currentPassword, user.password)) {
      return error(
        res,
        {
          message: "Your current password is incorrect.",
        },
        401
      );
    }

    await user.update({
      password: hashSync(newPassword, 10),
    });

    success(res, {
      message: "Password successfully updated",
    });
  } catch (e) {
    error(res, e);
  }
});

router.get("/club-settings", onlyUsers, async (req, res) => {
  try {
    const club = await Club.findOne({
      _id: req.user.club,
    }).exec();
    success(res, club);
  } catch (e) {
    error(res, e);
  }
});

router.patch("/club-settings", onlyUsers, async (req, res) => {
  try {
    const club = await Club.findOneAndUpdate(
      {
        _id: req.user.club,
      },
      { ...req.body }
    );
    success(res, {
      message: "Club updated",
    });
  } catch (e) {
    error(res, e);
  }
});

router.get("/users", onlyUsers, async (req, res) => {
  try {
    const users = await User.find({
      club: req.user.club,
    }).select("-password -club");
    success(res, users);
  } catch (e) {
    error(res, e);
  }
});

router.patch("/users-delete", onlyUsers, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.body.id,
    });
    success(res, {
      message: "User was deleted",
    });
  } catch (e) {
    error(res, e);
  }
});

router.patch("/product-delete", onlyUsers, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.body.id,
    });
    success(res, {
      message: "Product was deleted",
    });
  } catch (e) {
    error(res, e);
  }
});

router.get("/memberTypes", onlyUsers, async (req, res, next) => {
  try {
    const result = await MemberType.find({
      club: req.user.club,
    });
    success(res, result);
  } catch (e) {
    error(res, e);
  }
});

router.post("/memberTypes", onlyUsers, async (req, res, next) => {
  try {
    const memberType = new MemberType({
      _id: mongoose.Types.ObjectId(),
      ...req.body,
      club: req.user.club,
    });
    await memberType.save();
    success(res, {
      message: "Member Type was created",
    });
  } catch (e) {
    error(res, e);
  }
});

router.delete("/memberTypes/:id", onlyUsers, async (req, res, next) => {
  try {
    await MemberType.findOneAndDelete({
      _id: req.params.id,
    });
    success(res, {
      message: "Member Type was deleted",
    });
  } catch (e) {
    error(res, e);
  }
});

router.get(
  "/slots/:stamp",
  onlyUsers,
  async ({ params: { stamp }, user: { club } }, res) => {
    try {
      const teeSheet = await TeeSheet.findOne({
        stamp,
        club,
      });
      if (teeSheet === null) {
        throw new Error("No tee sheet found on " + stamp);
      }

      success(res, teeSheet.slots);
    } catch (e) {
      error(res, e);
    }
  }
);

router.post("/booking", onlyUsers, async (req, res) => {
  try {
    let teeSheet = await TeeSheet.findOne({
      stamp: req.body.day,
      club: req.user.club,
    });
    if (req.body.type === "locked") {
      console.log("Locked", req.body.type);
      teeSheet.slots = teeSheet.slots.map((slot) => {
        if (slot.code === req.body.slot) {
          let bookings = slot.bookings;
          bookings.push({ member: req.body.member, type: req.body.type });
          return {
            time: slot.time,
            code: slot.code,
            max: slot.max,
            bookings,
            requests: slot.requests,
            available: slot.available - 1,
            locked: slot.locked,
            hidden: slot.hidden,
          };
        }
        return slot;
      });
    }
    if (req.body.type === "ballot") {
      console.log("Ballot", req.body.type);
      teeSheet.ballotEntries = [...teeSheet.ballotEntries, { ...req.body }];
    }

    await teeSheet.save();
    success(res, teeSheet);
  } catch (e) {
    error(res, e);
  }
});

router.patch("/sheet-update", onlyUsers, async (req, res) => {
  try {
    const { sheet: sheetId, slot: slotCode, hidden, locked } = req.body;

    const teeSheet = await TeeSheet.findOne({
      _id: sheetId,
    });

    if (teeSheet == null) {
      console.log(teeSheet);
      throw new Error("Tee sheet not found");
    }

    teeSheet.slots = teeSheet.slots.map((slot) => {
      if (slot.code === slotCode) {
        slot.hidden = hidden;
        slot.locked = locked;
      }
      return slot;
    });

    await teeSheet.save();

    success(res, {
      message: "Slot updated",
    });
  } catch (e) {
    error(res, e);
  }
});

router.patch("/bookings-delete", async (req, res) => {
  try {
    const teeSheet = await TeeSheet.findOne({
      _id: req.body.sheet,
    });

    if (teeSheet == null) {
      throw new Error("Please pass a valid tee sheet id!");
    }

    teeSheet.slots = teeSheet.slots.map((slot) => {
      if (slot.code === req.body.slot) {
        let adder = 0;
        let bookings = slot.bookings.filter((booking) => {
          if (booking.member === req.body.member) {
            adder = adder + 1;
            return false;
          }
          return true;
        });
        return {
          time: slot.time,
          code: slot.code,
          max: slot.max,
          bookings,
          requests: slot.requests,
          available: slot.available + adder,
          locked: slot.locked,
          hidden: slot.hidden,
        };
      }
      return slot;
    });
    await teeSheet.save();
    success(res, {
      message: "Booking was delete",
    });
  } catch (e) {
    error(res, e);
  }
});

router.patch("/import-member", onlyUsers, async (req, res) => {
  try {
    const { email } = req.body;
    const member = await Member.findOne({ email });

    // If member does not exist throw an error
    if (member == null) {
      throw new Error("Email is not in use. Please register new member.");
    }

    // If member already belongs to club throw an error
    member.membership.forEach((clubship) => {
      if (clubship.club == req.user.club) {
        throw new Error("Member is already registered to the club.");
      }
    });

    member.membership = [
      ...member.membership,
      {
        ...req.body.membership,
        club: req.user.club,
      },
    ];

    await member.save();

    success(res, {
      message: "Member imported!",
    });
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

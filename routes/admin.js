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
      club: req.user.club,
    })
      .select("-password -dateOfBirth -memberSince -updatedAt -createdAt")
      .populate({
        path: "memberType",
      });
    success(
      res,
      members.map((member) => {
        member["profilePhoto"] = process.env.URL + "uploads/" + member.profilePhoto.filename;
        return member;
      })
    );
  } catch (e) {
    error(res, e);
  }
});

router.patch("/member-photo/:id", upload.single("profilePhoto"), async (req, res) => {
  try {
    const member = await Member.findOneAndUpdate(
      { _id: req.params.id },
      {
        profilePhoto: req.file,
      }
    );
    console.log(__dirname, "uploads", member.profilePhoto.fileName);
    const oldFilePath = path.join(__dirname, "../uploads", member.profilePhoto.filename);
    console.log(oldFilePath);
    fs.unlinkSync(oldFilePath);
    success(res, {
      message: "Photo was updated",
    });
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
    const categories = await Product.find({ club: req.user.club }).select("category").distinct("category");
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
    const user = await User.findOneAndUpdate({ _id: req.user.id }, { ...req.body });
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
    const memberType = new MemberType({ _id: mongoose.Types.ObjectId(), ...req.body, club: req.user.club });
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

router.get("/slots/:stamp", onlyUsers, async ({ params: { stamp }, user: { club } }, res) => {
  try {
    const teeSheet = await TeeSheet.findOne({
      stamp,
      club,
    });
    if (teeSheet === null) {
      throw new Error("No tee sheet found on " + stamp);
    }

    success(res, teeSheet);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

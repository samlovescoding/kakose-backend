const router = require("express").Router();

// IO Imports
const { success, error } = require("../utility/jsonio");

// Model Imports
const Booking = require("../models/booking");
const Club = require("../models/club");
const Member = require("../models/member");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// Middleware imports
const onlyUsers = require("../middlewares/onlyUsers");
const onlyMembers = require("../middlewares/onlyMembers");
const { compareSync, hashSync } = require("bcrypt");

router.get("/members", onlyUsers, async (req, res) => {
  try {
    const members = await Member.find({
      club: req.user.club,
    }).select(
      "-password -dateOfBirth -memberSince -updatedAt -createdAt"
    );
    success(
      res,
      members.map((member) => {
        member["profilePhoto"] =
          process.env.URL +
          "uploads/" +
          member.profilePhoto.filename;
        return member;
      })
    );
  } catch (e) {
    error(res, e);
  }
});

router.get(
  "/products",
  onlyUsers,
  async (req, res, next) => {
    try {
      const products = await Product.find({
        club: req.user.club,
      });
      success(res, products);
    } catch (e) {
      error(res, e);
    }
  }
);

router.get("/profile", onlyUsers, async (req, res) => {
  try {
    success(res, req.user);
  } catch (e) {
    error(res, e);
  }
});

router.patch(
  "/update-profile",
  onlyUsers,
  async (req, res) => {
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
  }
);

router.patch(
  "/update-password",
  onlyUsers,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id });

      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;
      const confirmPassword = req.body.confirmPassword;

      if (confirmPassword !== newPassword) {
        return error(
          res,
          {
            message:
              "Confirm password dont match the new password.",
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
  }
);

router.get(
  "/club-settings",
  onlyUsers,
  async (req, res) => {
    try {
      const club = await Club.findOne({
        _id: req.user.club,
      }).exec();
      success(res, club);
    } catch (e) {
      error(res, e);
    }
  }
);

module.exports = router;

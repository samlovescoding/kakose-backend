const express = require("express");
const router = express.Router();
const onlyMembers = require("../middlewares/onlyMembers");
const Order = require("../models/order");
const { success, error } = require("../utility/jsonio");

// GET / - List products ordered by member
router.get("/", onlyMembers, async (req, res, next) => {
  try {
    const orders = await Order.find({
      member: req.member,
    });
    success(res, orders);
  } catch (e) {
    error(e);
  }
});

// POST / - Place an order
router.post("/", async (req, res, next) => {
  try {
    const order = new Order({
      ...req.body,
    });
    await order.save();
    success(res, {
      message: "Successfully ordered.",
    });
  } catch (e) {
    error(e);
  }
});

// GET /callback - Merchant Callback
router.get("/callback", async (req, res, next) => {
  success(res, { request: req });
});

// DELETE /:id - Cancel an order
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findOneAndDelete({
      _id: id,
    });
    success(res, {
      message: "Successfully deleted the order.",
    });
  } catch (e) {
    error(e);
  }
});

module.exports = router;

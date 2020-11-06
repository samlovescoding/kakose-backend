const router = require("express").Router();

// IO Imports
const { success, error } = require("../utility/jsonio");

// Model Imports
const Booking = require("../models/booking");
const Club = require("../models/club");
const Configuration = require("../models/configuration");
const Member = require("../models/member");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    success(res, req);
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

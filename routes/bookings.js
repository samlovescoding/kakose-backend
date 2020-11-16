const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { success, error } = require("../utility/jsonio");
const onlyUsers = require("../middlewares/onlyUsers");
const booking = require("../models/booking"); // This is supposed to be a mongoose model.
const { body, query } = require("express-validator");
const randomDate = require("../utility/randomDate");
const numberToEnglish = require("../utility/numberToEnglish");

module.exports = router;

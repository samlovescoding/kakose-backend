const express = require("express");
const router = express.Router();
const { success, error } = require("../utility/jsonio");

router.use("/", (req, res, next) => {
  success(res, "Response was served");
});

module.exports = router;

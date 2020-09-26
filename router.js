const express = require("express");
const router = express.Router();

router.use("/users", require("./routes/users"));
router.use("/members", require("./routes/members"));

module.exports = router;

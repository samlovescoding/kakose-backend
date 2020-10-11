const express = require("express");
const router = express.Router();

router.use("/users", require("./routes/users"));
router.use("/members", require("./routes/members"));
router.use("/config", require("./routes/configurations"));
router.use("/bookings", require("./routes/bookings"));

module.exports = router;

const express = require("express");
const router = express.Router();

router.use("/users", require("./routes/users"));
router.use("/members", require("./routes/members"));
router.use("/bookings", require("./routes/bookings"));
router.use("/products", require("./routes/products"));
router.use("/clubs", require("./routes/clubs"));
router.use("/my", require("./routes/my"));
router.use("/admin", require("./routes/admin"));
router.use("/templates", require("./routes/teeTemplates"));
router.use("/sheets", require("./routes/teeSheets"));
router.use("/ballot", require("./routes/ballot"));
router.use("/api", require("./routes/frontend"));

module.exports = router;

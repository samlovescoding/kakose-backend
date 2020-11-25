const router = require("express").Router();
const { error, success } = require("../utility/jsonio");
const onlyUsers = require("../middlewares/onlyUsers");

const TeeSheet = require("../models/teeSheet");
const MemberTypes = require("../models/memberType");

const ballot = require("../utility/ballot");

router.post("/:id", onlyUsers, async (req, res) => {
  try {
    let teeSheet = await ballot(req.params.id, req.user.club);

    success(res, {
      message: "Ballot was ran",
      teeSheet,
    });
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

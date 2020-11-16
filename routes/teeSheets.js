const router = require("express").Router();

const onlyUsers = require("../middlewares/onlyUsers");

const TeeSheet = require("../models/teeSheet.js");

router.get("/:stamp", onlyUsers, async (req, res) => {
  try {
    const { stamp } = req.params;
    const teeSheet = await TeeSheet.findOne({
      stamp,
      club: req.user.club,
    }).populate({
      path: "template",
    });
    success(res, teeSheet);
  } catch (e) {
    error(res, e);
  }
});

router.post("/:stamp", onlyUsers, async (req, res) => {
  try {
    const { stamp } = req.params;
    let sheet = new TeeSheet({ ...req.body, stamp, club: req.user.club });
    await sheet.save();
    sheet = await TeeSheet.findOne({}).populate({
      path: "template",
    });
    success(res, {
      message: "Sheet was created",
      sheet,
    });
  } catch (e) {
    error(res, e);
  }
});

router.patch("/:id", onlyUsers, async (req, res) => {
  try {
    const sheet = await TeeSheet.findOneAndUpdate({ _id: req.params.id }, { ...req.body });
    success(res, {
      message: "Sheet was updated",
      updates: { ...req.body },
    });
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

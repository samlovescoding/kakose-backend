const router = require("express").Router();
const { success, error } = require("../utility/jsonio");
const onlyUsers = require("../middlewares/onlyUsers");
const TeeTemplate = require("../models/teeTemplate");

router.post("/", onlyUsers, async (req, res) => {
  try {
    const teeTemplate = new TeeTemplate({
      ...req.body,
      club: req.user.club,
    });
    await teeTemplate.save();
    success(res, {
      message: "Tee Template saved.",
    });
  } catch (e) {
    error(res, e);
  }
});

router.get("/", onlyUsers, async (req, res) => {
  try {
    const teeTemplates = await TeeTemplate.find({
      club: req.user.club,
    });
    success(res, teeTemplates);
  } catch (e) {
    error(res, e);
  }
});

router.get("/:id", onlyUsers, async (req, res) => {
  try {
    const template = await TeeTemplate.findOne({
      _id: req.params.id,
    });
    success(res, template);
  } catch (e) {
    error(res, e);
  }
});

router.delete("/:id", onlyUsers, async (req, res) => {
  try {
    await TeeTemplate.findOneAndDelete({
      _id: req.params.id,
    });
    success(res, {
      message: "Tee Template deleted.",
    });
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

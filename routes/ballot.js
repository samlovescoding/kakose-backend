const router = require("express").Router();
const { error, success } = require("../utility/jsonio");
const onlyUsers = require("../middlewares/onlyUsers");
const TeeSheet = require("../models/teeSheet");

router.post("/:id", onlyUsers, async (req, res) => {
  try {
    let teeSheet = await TeeSheet.findOne({
      _id: req.params.id,
      club: req.user.club,
    })
      .populate("club")
      .populate("template")
      .populate({ path: "ballotEntries.member", ref: "members" });

    if (teeSheet.ballot == true) {
      teeSheet.ballotEntries.forEach((entry) => {
        // For every ballot entry
        let slots = teeSheet.slots;

        // Update slots
        let incrementorMultiplier = 1;
        let foundSlot = false;
        let cannotFindSlot = false;
        for (let i = 0; i < slots.length; i++) {
          let slot = slots[i];
          if (slot.code === entry.slot) {
            // Found the ideal spot
            if (slot.available > 0) {
              // Booking is available in spot
              slots[i] = {
                ...slot,
                // Decrease availability
                available: slot.available - 1,
                // Add a new booking
                bookings: [...slot.bookings, { member: entry.member._id, type: "locked" }],
              };
              foundSlot = true;
            }

            while (foundSlot != true || cannotFindSlot == true) {
              // Backtrack above
              // Backtrack below
            }
          }
        }

        teeSheet.slots = slots;
      });
    }

    // await teeSheet.save();

    success(res, {
      message: "Sheet was updated",
      teeSheet,
    });
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;

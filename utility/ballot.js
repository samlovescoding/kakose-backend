const TeeSheet = require("../models/teeSheet");
const MemberTypes = require("../models/memberType");

module.exports = async (sheetId, clubId) => {
  try {
    let teeSheet = await TeeSheet.findOne({
      _id: sheetId,
      club: clubId,
    })
      .populate("club")
      .populate("template")
      .populate({ path: "ballotEntries.member", ref: "members" });

    let memberTypes = await MemberTypes.find({ club: clubId });

    memberTypes = memberTypes.reduce((accumulator, current) => {
      accumulator[current._id] = current;
      return accumulator;
    }, {});

    if (teeSheet.ballot == true) {
      teeSheet.ballotEntries
        .map((entry) => {
          entry.member.clubship = null;
          entry.member.membership.map((clubship) => {
            if (clubship.club == clubId) {
              entry.member.clubship = clubship;
            }
          });
          return entry;
        })
        .sort((a, b) => {
          // Sort entries with respect to member priority

          let ap, bp;

          const a_type = memberTypes[a.member.clubship.type];
          const b_type = memberTypes[b.member.clubship.type];

          ap = a_type.priorityPercentage;
          bp = b_type.priorityPercentage;

          // return ap - bp; // Sorts ascendingly
          return bp - ap; // Sorts descendingly
        })
        .forEach((entry) => {
          // For every ballot entry
          let slots = teeSheet.slots;

          // Update slots
          let alpha = 1; // Incrementor multiplier
          let foundSlot = false;
          let canFindSlotAbove = true;
          let canFindSlotBelow = true;
          let canFindSlot = true;
          let blankEntry = { member: entry.member._id, type: "locked" };

          for (let i = 0; i < slots.length; i++) {
            let slot = slots[i];
            if (slot.code === entry.slot) {
              // Found the ideal spot
              if (slot.available > 0) {
                // Add entry to bookings
                // Booking is available in spot
                slots[i].available = slots[i].available - 1;
                slots[i].bookings.push(blankEntry);
                console.log("Found the ideal slot");
                // slots[i] = {
                //   ...slot,
                //   // Decrease availability
                //   available: slot.available - 1,
                //   // Add a new booking
                //   bookings: [...slot.bookings, blankEntry],
                // };
                // console.log("Found Ballot Spot by first match");
                foundSlot = true;
              }

              while (foundSlot === false && canFindSlot === true) {
                // Backtrack above
                if (canFindSlotAbove) {
                  let slotIndex = i - alpha;
                  if (slotIndex < 0) {
                    // There is not slot above to go to.
                    canFindSlotAbove = false;
                  } else {
                    let slot = slots[slotIndex];
                    if (slot.available > 0) {
                      // Add entry to bookings
                      slots[slotIndex].available = slots[slotIndex].available - 1;
                      slots[slotIndex].bookings.push(blankEntry);
                      // slot.available = slot.available - 1;
                      // slot.bookings = [...slot.bookings, blankEntry];
                      // slots[slotIndex] = slot;
                      foundSlot = true;
                    }
                  }
                }
                // Backtrack below
                if (canFindSlotBelow) {
                  let slotIndex = i + alpha;
                  if (slotIndex > slots.length) {
                    canFindSlotBelow = false;
                  } else {
                    if (slot.available > 0) {
                      // Add entry to bookings
                      slot.available = slot.available - 1;
                      slots.bookings = [...slot.bookings, blankEntry];
                      slots[slotIndex] = slot;
                      foundSlot = true;
                    }
                  }
                }

                // Can we find a slot
                canFindSlot = canFindSlotAbove || canFindSlotBelow;
                alpha = alpha + 1;
              }
            }
          }

          teeSheet.slots = slots;
        });
    }

    teeSheet.ballot = false;
    teeSheet.ballotEntries = [];
    await teeSheet.save();
    return teeSheet;
  } catch (e) {
    return false;
  }
};

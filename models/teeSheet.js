const mongoose = require("mongoose");

const ballotEntrySchema = mongoose.Schema({
  day: String,
  slot: Number,
  type: String,
  member: { type: mongoose.Schema.Types.ObjectId, ref: "members" },
});

const bookingSchema = mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "members" },
  type: String,
});

const slotSchema = mongoose.Schema({
  time: String,
  code: Number,
  max: Number,
  bookings: [bookingSchema],
  available: Number,
  locked: Boolean,
  hidden: Boolean,
});

const schema = mongoose.Schema(
  {
    stamp: { type: String },
    slots: [slotSchema],
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teeTemplate",
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club",
    },
    sheetType: String,
    ballot: Boolean,
    ballotEntries: [ballotEntrySchema],
    ballotRunDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("teeSheet", schema);

const mongoose = require("mongoose");

const ballotEntrySchema = mongoose.Schema({
  day: String,
  slot: Number,
  type: String,
  member: { type: mongoose.Schema.Types.ObjectId, ref: "members" },
});

const schema = mongoose.Schema(
  {
    stamp: { type: String },
    slots: { type: Array, default: [] },
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

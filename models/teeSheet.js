const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("teeSheet", schema);

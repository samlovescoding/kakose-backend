const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String },
    type: { type: String },
    players: { type: Number },
    startTime: { type: String },
    endTime: { type: String },
    intervalTime: { type: Number },
    club: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model("teeTemplate", schema);

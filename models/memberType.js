const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    priorityPercentage: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "club" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("memberTypes", schema);

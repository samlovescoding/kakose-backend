const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    timing: { type: Date, required: true },
    memberBookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "members",
      required: true,
    },
    locked: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
      required: true,
    },
    slot: mongoose.Schema.Types.String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", schema);

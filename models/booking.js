const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    timing: { type: Date, required: true },
    memberBookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: true,
    },
    locked: {
      type: mongoose.Schema.Types.Boolean,
      default: true,
      required: true,
    },
    profilePhoto: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", schema);

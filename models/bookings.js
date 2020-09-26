const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    timing: { type: Date, required: true },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", schema);

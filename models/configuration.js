const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String, default: "system" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("settings", schema);

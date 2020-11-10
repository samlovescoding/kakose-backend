const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    role: { type: String, required: true, default: "club" },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, required: true },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", schema);

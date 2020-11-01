const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, required: true },
    sex: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    memberType: { type: String, required: true, default: "Junior" },
    dateOfBirth: { type: Date, required: true },
    memberSince: { type: Date, required: true },
    profilePhoto: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("members", schema);

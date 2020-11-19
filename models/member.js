const mongoose = require("mongoose");

const membershipSchema = mongoose.Schema({
  type: { type: mongoose.Schema.Types.Mixed, ref: "memberTypes" },
  since: { type: Date, default: null },
  validity: { type: Number, default: 30 },
  expired: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "club", required: true },
});

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
    dateOfBirth: { type: Date, required: true },
    profilePhoto: {
      type: mongoose.Schema.Types.Mixed,
    },
    membership: [membershipSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("members", schema);

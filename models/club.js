const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tee_time_length: { type: Number },
    tee_time_max_bookings: { type: Number },
    club_opening_time: { type: Number, default: 0 },
    club_closing_time: { type: Number, default: 1439 },
  },
  { timestamps: true }
);

schema.plugin(uniqueValidator, {
  message: "Club slug must be unique.",
});
module.exports = mongoose.model("club", schema);

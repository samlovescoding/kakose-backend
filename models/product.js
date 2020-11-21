const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
      type: Number,
      default: 1,
    },
    unit: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.Array,
      required: true,
      default: [],
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    photo: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", schema);

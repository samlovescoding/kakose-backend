const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", schema);

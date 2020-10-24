const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "members",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    cancellable: {
      type: Boolean,
      default: true,
    },
    merchant: {
      type: String,
      default: "stripe",
    },
    merchantResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", schema);

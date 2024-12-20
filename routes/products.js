const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { success, error } = require("../utility/jsonio");
const onlyUsers = require("../middlewares/onlyUsers");
const upload = require("../middlewares/upload");
const Product = require("../models/product");

// Get / - List all the products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    success(res, products);
  } catch (e) {
    error(e);
  }
});

// Get /:id - Get full information about a single product
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      _id: id,
    });
    success(res, product);
  } catch (e) {
    error(e);
  }
});

// POST / - Create a new product
router.post(
  "/",
  onlyUsers,
  [body("name").exists(), body("price").exists(), body("category").exists()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return error(res, errors.array());
      }
      const product = new Product({
        _id: mongoose.Types.ObjectId(),
        ...req.body,
        club: req.user.club,
      });
      await product.save();
      success(res, {
        message: "Product saved!",
        product,
      });
    } catch (e) {
      error(res, e);
    }
  }
);

// PUT /:id - Upload an image
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    console.log({
      photo: req.file,
    });

    let product = await Product.findOne({
      _id: req.params.id,
    });
    product.photo = req.file;
    await product.save();
    success(res, {
      message: "File Uploaded",
      product,
    });
  } catch (e) {
    error(res, e);
  }
});

// PATCH /:id - Update an existing product
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
      },
      { ...req.body }
    );
    success(res, {
      message: "Product Updated",
      product,
    });
  } catch (e) {
    error(e);
  }
});

// DELETE /:id - Delete an existing product
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOneAndDelete({
      _id: id,
    });
    success(res, {
      message: "Product Deleted",
    });
  } catch (e) {
    error(e);
  }
});

module.exports = router;

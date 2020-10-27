const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { success, error } = require("../utility/jsonio");

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
router.post("/", [body("name").exists(), body("price").exists(), body("category").exists()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, errors.array());
    }
    const product = new Product(...req.body);
    await product.save();
    success(res, {
      message: "Product saved!",
    });
  } catch (e) {
    error(e);
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

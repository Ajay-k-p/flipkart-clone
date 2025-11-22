const express = require("express");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const router = express.Router();

// ----------------------
// Cloudinary Config
// ----------------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer (store uploaded file temporarily)
const upload = multer({ dest: "temp/" });

// ----------------------
// UPLOAD TO CLOUDINARY
// ----------------------
const uploadToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "flipkart_products",
    });
    fs.unlinkSync(localFilePath); // remove temp file
    return result.secure_url;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    throw err;
  }
};

// ----------------------
// GET ALL PRODUCTS
// ----------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ----------------------
// ADD PRODUCT
// ----------------------
router.post("/", auth, adminAuth, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      image: imageUrl,
      description: req.body.description,
      category: req.body.category,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log("Add Product Error:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// ----------------------
// UPDATE PRODUCT
// ----------------------
router.put("/:id", auth, adminAuth, upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      category: req.body.category,
    };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.log("Update Product Error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// ----------------------
// DELETE PRODUCT
// ----------------------
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log("Delete Product Error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;

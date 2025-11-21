const express = require("express");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// ===============================
// Multer Setup
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Helper to create correct image URL
const getImageUrl = (req, filename) => {
  const BASE_URL =
    process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

  return `${BASE_URL}/uploads/${filename}`;
};

// ===============================
// GET ALL PRODUCTS (Public)
// ===============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ===============================
// ADD PRODUCT (Admin Only)
// ===============================
router.post("/", auth, adminAuth, upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file ? getImageUrl(req, req.file.filename) : null;

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      image: imageUrl,
      description: req.body.description || "",
      category: req.body.category || "general",
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// ===============================
// UPDATE PRODUCT (Admin Only)
// ===============================
router.put(
  "/:id",
  auth,
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        category: req.body.category,
      };

      // If new image uploaded → save new URL
      if (req.file) {
        updateData.image = getImageUrl(req, req.file.filename);
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });

      res.json(updatedProduct);
    } catch (err) {
      console.error("Update Product Error:", err);
      res.status(500).json({ message: "Failed to update product" });
    }
  }
);

// ===============================
// DELETE PRODUCT (Admin Only)
// ===============================
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;

const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// =========================
// Multer Setup
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// =========================
// GET ALL PRODUCTS (PUBLIC)
// =========================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// =========================
// ADD PRODUCT (ADMIN ONLY)
// =========================
router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, description, category } = req.body;

    const newProduct = new Product({
      name,
      price,
      quantity,
      description: description || "",
      category: category || "general",
      image: req.file ? req.file.filename : null, // only filename stored
    });

    await newProduct.save();
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product', error: err });
  }
});

// =========================
// UPDATE PRODUCT (ADMIN ONLY)
// =========================
router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, description, category } = req.body;

    const updateData = {
      name,
      price,
      quantity,
      description,
      category
    };

    // Update image only if provided
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product', error: err });
  }
});

// =========================
// DELETE PRODUCT (ADMIN ONLY)
// =========================
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;

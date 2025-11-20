const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/* ---------------------------------------------------
   GET ALL ORDERS (Admin Only)
   Includes Product name, image, price
   Includes User name, email
--------------------------------------------------- */
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId', 'name image price');

    res.json(orders);
  } catch (error) {
    console.error('Admin Get Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

/* ---------------------------------------------------
   UPDATE ORDER STATUS (Admin Only)
--------------------------------------------------- */
router.put('/orders/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, expectedDelivery } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, expectedDelivery },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('products.productId', 'name image price');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Emit socket update to the user
    const io = req.app.get('io');
    if (io) io.emit('orderUpdated', { userId: order.userId, order });

    res.json(order);
  } catch (error) {
    console.error('Order Update Error:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

/* ---------------------------------------------------
   CREATE PRODUCT (Admin Only)
--------------------------------------------------- */
router.post('/product', auth, adminAuth, async (req, res) => {
  try {
    const { name, price, quantity, image, category, description } = req.body;

    const newProduct = new Product({
      name,
      price,
      quantity,
      image,
      category,
      description,
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

/* ---------------------------------------------------
   EDIT PRODUCT (Admin Only)
--------------------------------------------------- */
router.put('/product/:id', auth, adminAuth, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Edit Product Error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

/* ---------------------------------------------------
   DELETE PRODUCT (Admin Only)
--------------------------------------------------- */
router.delete('/product/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
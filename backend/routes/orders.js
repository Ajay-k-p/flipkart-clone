const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PLACE ORDER (USER)
|--------------------------------------------------------------------------
*/
router.post("/", auth, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: "No products in order" });
    }

    let enrichedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      // ❌ If out of stock
      if (Number(product.quantity) < Number(item.quantity)) {
        return res.status(400).json({
          message: `"${product.name}" is out of stock`,
          availableStock: product.quantity,
        });
      }

      // -----------------------------------------
      // 🔥 CORRECT STOCK REDUCTION (ATLAS SAFE)
      // -----------------------------------------
      const newQty = Number(product.quantity) - Number(item.quantity);
      await Product.updateOne(
        { _id: product._id },
        {
          quantity: newQty,
          isOutOfStock: newQty <= 0
        }
      );

      // -----------------------------------------
      // Store product snapshot inside order
      // (image is Cloudinary URL already)
      // -----------------------------------------
      enrichedProducts.push({
        productId: product._id,
        productName: product.name,
        productImage: product.image, // Cloudinary URL
        quantity: item.quantity,
        price: item.price,
      });
    }

    // -----------------------------------------
    // Save order
    // -----------------------------------------
    const order = new Order({
      userId: req.user.id,
      products: enrichedProducts,
      status: "Pending",
    });

    await order.save();

    // 🔔 Notify admin via socket
    const io = req.app.get("io");
    if (io) io.emit("orderPlaced", order);

    res.status(201).json({ message: "Order placed successfully", order });

  } catch (error) {
    console.error("Order Place Error:", error);
    res.status(500).json({ message: "Error placing order" });
  }
});

/*
|--------------------------------------------------------------------------
| GET USER ORDERS
|--------------------------------------------------------------------------
*/
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN — GET ALL ORDERS
|--------------------------------------------------------------------------
*/
router.get("/admin/all", auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN — UPDATE ORDER
|--------------------------------------------------------------------------
*/
router.put("/admin/update/:id", auth, adminAuth, async (req, res) => {
  try {
    const { status, expectedDelivery } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, expectedDelivery },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);

  } catch (error) {
    console.error("Admin Update Order Error:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

module.exports = router;

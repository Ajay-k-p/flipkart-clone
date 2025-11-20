const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();


// ===============================
//     PLACE ORDER (USER)
// ===============================
router.post("/", auth, async (req, res) => {
  try {
    const { products } = req.body;

    // Attach productName + productImage from DB
    const enrichedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);

        return {
          productId: product._id,
          productName: product.name,
          productImage: product.image.startsWith("http")
            ? product.image
            : `${process.env.BASE_URL}${product.image}`,
          quantity: item.quantity,
          price: item.price
        };
      })
    );

    const order = new Order({
      userId: req.user.id,
      products: enrichedProducts,
      status: "Pending"
    });

    await order.save();

    // Notify admin via socket
    const io = req.app.get("io");
    if (io) io.emit("orderPlaced", order);

    res.status(201).json(order);

  } catch (error) {
    console.error("Order Place Error:", error);
    res.status(500).json({ message: "Error placing order" });
  }
});


// ===============================
//     GET USER ORDERS
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);

  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


// ===============================
//     ADMIN: GET ALL ORDERS
// ===============================
// ⭐ UPDATED HERE → populate user name + email
router.get("/admin/all", auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")   // ⭐ FIX: This shows user name in admin
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});


// ===============================
//     ADMIN: UPDATE ORDER
// ===============================
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

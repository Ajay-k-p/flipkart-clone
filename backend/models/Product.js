const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"] 
    },

    price: { 
      type: Number, 
      required: [true, "Price is required"], 
      min: [1, "Price must be greater than ₹0"] 
    },

    quantity: { 
      type: Number, 
      required: [true, "Quantity is required"], 
      min: [0, "Quantity cannot be negative"], 
      default: 0 
    },

    image: { 
      type: String, 
      default: null 
    },

    description: { 
      type: String, 
      default: "" 
    },

    category: { 
      type: String, 
      default: "general" 
    },

    isOutOfStock: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// 🔥 AUTO UPDATE Out Of Stock STATUS
productSchema.pre("save", function (next) {
  this.isOutOfStock = this.quantity <= 0;
  next();
});

module.exports = mongoose.model("Product", productSchema);

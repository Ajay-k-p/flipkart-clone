const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },

      productName: { 
        type: String, 
        required: true 
      },

      productImage: { 
        type: String, 
        required: true 
      },

      quantity: { 
        type: Number, 
        required: true 
      },

      price: { 
        type: Number, 
        required: true 
      },
    }
  ],

  status: { 
    type: String, 
    enum: ['Pending', 'Shipped', 'Delivered'], 
    default: 'Pending' 
  },

  expectedDelivery: { 
    type: Date 
  },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

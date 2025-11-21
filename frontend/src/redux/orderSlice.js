import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [], // cart items
  list: []  // user orders
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Block if out of stock
      if (Number(item.quantity ?? item.stock) <= 0) {
        alert("Cannot add: Product is out of stock");
        return;
      }

      const existing = state.cart.find((c) => c._id === item._id);

      if (existing) {
        const newQty = (existing.quantity || 1) + 1;
        const maxStock = Number(item.quantity ?? existing.stock ?? 1);

        existing.quantity = Math.min(newQty, maxStock);
      } else {
        state.cart.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          stock: Number(item.quantity ?? item.stock ?? 0)
        });
      }
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((c) => c._id !== action.payload);
    },

    clearCart: (state) => {
      state.cart = [];
    },

    setOrders: (state, action) => {
      state.list = action.payload;
    },

    updateCartStock: (state, action) => {
      const map = action.payload; // { productId: newStock }
      
      state.cart = state.cart.map((c) => ({
        ...c,
        stock: map[c._id] ?? c.stock
      }));
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setOrders,
  updateCartStock
} = orderSlice.actions;

export default orderSlice.reducer;

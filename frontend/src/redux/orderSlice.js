import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], cart: [] },
  reducers: {
    setOrders: (state, action) => {
      state.list = action.payload;
    },

    updateOrder: (state, action) => {
      const index = state.list.findIndex(o => o._id === action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
    },

    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },

    // ✅ REMOVE ITEM FROM CART
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    },

    // Clear all items
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// export everything
export const { setOrders, updateOrder, addToCart, removeFromCart, clearCart } =
  orderSlice.actions;

export default orderSlice.reducer;

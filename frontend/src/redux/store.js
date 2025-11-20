import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';
import authReducer from './authSlice';  // Add this import
import productReducer from './productSlice';  // If you have it

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    auth: authReducer,  // Add this
    products: productReducer,  // If applicable
  },
});

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CartPage from './pages/CartPage';
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import socket from './socket';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from './redux/productSlice';
//import { updateOrder } from './redux/orderSlice';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('productAdded', (product) => dispatch(addProduct(product)));
    socket.on('orderUpdated', (data) => dispatch(updateOrder(data.order)));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ⭐ ADD THIS ROUTE ⭐ */}
        <Route path="/search" element={<ProductList />} />

        <Route path="/" element={<ProductList />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

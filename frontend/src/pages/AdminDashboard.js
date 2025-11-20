import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Header from '../components/Header';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("addProduct");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    image: null,
    id: null
  });

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch failed:", err);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Product fetch failed:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchProducts();
    }
  }, [token]);

  // Add / Update Product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("quantity", newProduct.quantity);
    if (newProduct.image) formData.append("image", newProduct.image);

    try {
      if (newProduct.id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/products/${newProduct.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("Product Updated!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/products`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("Product Added!");
      }

      setNewProduct({ name: '', price: '', quantity: '', image: null, id: null });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete Product?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product Deleted!");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Product
  const handleEditProduct = (prod) => {
    setNewProduct({
      name: prod.name,
      price: prod.price,
      quantity: prod.quantity,
      id: prod._id,
      image: null
    });

    setActiveTab("addProduct");
  };

  // Update Order
  const handleUpdateOrder = async (id, status, expectedDelivery) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/admin/update/${id}`,
        { status, expectedDelivery },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(orders.map(o => (o._id === id ? res.data : o)));

      alert("Order Updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  return (
    <>
      <Header />

      <div className="admin-page">

        {/* TOP HEADER WITH DROPDOWN */}
        <div className="admin-header">
          <h1 className="admin-heading">Admin Dashboard</h1>

          <select
            className="admin-dropdown"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="addProduct">Add Product</option>
            <option value="manageProducts">Manage Products</option>
            <option value="manageOrders">Manage Orders</option>
          </select>
        </div>

        {/* ADD PRODUCT — CENTERED */}
        {activeTab === "addProduct" && (
          <div className="section add-product-wrapper">
            <div className="add-product-card">

              <h2 className="section-title">
                {newProduct.id ? "Edit Product" : "Add Product"}
              </h2>

              <form onSubmit={handleAddProduct}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  className="input-field"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  className="input-field"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                  required
                />

                {/* Existing Product Image */}
                {newProduct.id &&
                  products.find((p) => p._id === newProduct.id)?.image && (
                    <img
                      src={products.find((p) => p._id === newProduct.id).image}
                      alt="current"
                      className="admin-small-img"
                    />
                  )}

                <input
                  type="file"
                  className="input-file"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                />

                <button className="btn-yellow">
                  {newProduct.id ? "Update Product" : "Add Product"}
                </button>
              </form>

            </div>
          </div>
        )}

        {/* MANAGE PRODUCTS — GRID */}
        {activeTab === "manageProducts" && (
          <div className="section">
            <h2 className="section-title">Manage Products</h2>

            <div className="admin-grid">
              {products.map((prod) => (
                <div key={prod._id} className="admin-small-card">
                  <img src={prod.image} alt="" className="admin-small-img" />

                  <p><strong>Name:</strong> {prod.name}</p>
                  <p><strong>Price:</strong> ₹{prod.price}</p>
                  <p><strong>Qty:</strong> {prod.quantity}</p>

                  <button className="btn-yellow" onClick={() => handleEditProduct(prod)}>
                    Edit
                  </button>

                  <button className="btn-red" onClick={() => handleDeleteProduct(prod._id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MANAGE ORDERS — GRID */}
        {activeTab === "manageOrders" && (
          <div className="section">
            <h2 className="section-title">Manage Orders</h2>

            <div className="admin-grid">
              {orders.map((order) => (
                <div key={order._id} className="admin-small-card">
                  <p><strong>User:</strong> {order.userId?.name}</p>
                  <p><strong>Status:</strong> {order.status}</p>

                  {order.products.map((p, idx) => (
                    <div key={idx} className="order-product-item">
                      <p><strong>{p.productName}</strong></p>
                      <p>Qty: {p.quantity}</p>
                      <p>₹{p.price}</p>
                    </div>
                  ))}

                  <select
                    className="select-field"
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateOrder(order._id, e.target.value, order.expectedDelivery)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <input
                    type="date"
                    className="date-field"
                    value={
                      order.expectedDelivery
                        ? new Date(order.expectedDelivery).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleUpdateOrder(order._id, order.status, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminDashboard;

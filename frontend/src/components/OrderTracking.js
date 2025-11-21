import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOrders } from '../redux/orderSlice';
import "./OrderTracking.css";
import axios from 'axios';

const OrderTracking = () => {
  const { list: orders } = useSelector(state => state.orders);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(setOrders(res.data));
      } catch (err) {
        console.error("Order fetch error:", err);
        alert(err.response?.data?.message || "Failed to load orders");
      }
    };

    fetchOrders();
  }, [dispatch, token]);

  // Status color
  const getStatusColor = (status) => {
    if (status === "Delivered") return "text-green-600 font-bold";
    if (status === "Shipped") return "text-blue-600 font-bold";
    return "text-orange-600 font-bold"; // Pending
  };

  // ⭐ FIX: build full image URL
  const resolveImage = (img) => {
    if (!img) return "/placeholder-image.png";

    // If already full URL, keep it
    if (img.startsWith("http") || img.startsWith("https")) return img;

    // Otherwise, add backend uploads path
    return `${process.env.REACT_APP_API_URL}/uploads/${img}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Tracking</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border p-4 mb-6 rounded-lg shadow-md bg-white">

            <h3 className="text-lg font-semibold">
              Order ID: {order._id}
            </h3>

            <p className={`mt-1 ${getStatusColor(order.status)}`}>
              Status: {order.status}
            </p>

            {order.expectedDelivery && (
              <p className="text-sm text-gray-600">
                Expected Delivery:{" "}
                {new Date(order.expectedDelivery).toLocaleDateString()}
              </p>
            )}

            <div className="mt-4 space-y-4">
              {order.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  {/* ⭐ PRODUCT IMAGE FIXED */}
                  <img
                    src={resolveImage(item.productImage)}
                    alt={item.productName}
                    className="product-img"
                    onError={(e) => (e.target.src = "/placeholder-image.png")}
                  />

                  <div>
                    <p className="font-semibold text-lg">{item.productName}</p>
                    <p className="text-sm text-gray-700">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Price: ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default OrderTracking;

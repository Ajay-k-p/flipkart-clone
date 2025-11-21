import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearCart } from "../redux/orderSlice";
import Header from "../components/Header";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const buyNowProduct = location.state?.buyNowProduct;
  const cart = useSelector((state) => state.orders.cart);

  // Build product list for order
  const productsToOrder = buyNowProduct
    ? [
        {
          productId: buyNowProduct._id,
          quantity: 1,
          price: buyNowProduct.price,
          stock: buyNowProduct.quantity,
        },
      ]
    : cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity || 1,
        price: item.price,
        stock: item.quantity,
      }));

  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // 🔥 Check if any product is out of stock
    const outOfStock = productsToOrder.find((p) => Number(p.stock) <= 0);
    if (outOfStock) {
      alert(`"${outOfStock.productName}" is out of stock!`);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {
          products: productsToOrder.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!buyNowProduct) dispatch(clearCart());

      // 🔥 Force product list to refresh new stock next visit
      localStorage.setItem("refreshProducts", "true");

      alert("Order placed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <>
      <Header />

      <div className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-items">
          {buyNowProduct ? (
            <div className="checkout-item">
              <img
                src={buyNowProduct.image}
                alt=""
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />
              <p>{buyNowProduct.name}</p>
              <p>₹{buyNowProduct.price}</p>
              <p>Stock: {buyNowProduct.quantity}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="checkout-item" key={item._id}>
                <img
                  src={item.image}
                  alt=""
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png";
                  }}
                />
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <p>Stock: {item.quantity}</p>
              </div>
            ))
          )}
        </div>

        <button className="place-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </>
  );
};

export default Checkout;

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/orderSlice";
import axios from "axios";
import Header from "../components/Header";
import "./CartPage.css";

const CartPage = () => {
  const cart = useSelector((state) => state.orders.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    // Prevent checkout if any item is out of stock
    const outOfStock = cart.find((c) => c.quantity <= 0);
    if (outOfStock) {
      alert(`"${outOfStock.name}" is out of stock! Remove it to continue.`);
      return;
    }

    setIsLoading(true);

    try {
      const products = cart.map((item) => ({
        productId: item._id,
        quantity: 1,
        price: item.price,
      }));

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        { products },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(clearCart());
      alert("Order placed successfully!");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Order failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="cart-page">
        <h1 className="cart-title">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-grid">
              {cart.map((item) => (
                <div key={item._id} className="cart-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-img"
                    onError={(e) => {
                      if (!e.target.dataset.error) {
                        e.target.dataset.error = "true";
                        e.target.src = "/placeholder-image.png";
                      }
                    }}
                  />

                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">₹{item.price}</p>

                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className={`buy-btn ${isLoading ? "disabled-btn" : ""}`}
            >
              {isLoading ? "Placing Order..." : "Buy Now"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;

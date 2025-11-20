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
  
  // If Buy Now → product comes from state
  const buyNowProduct = location.state?.buyNowProduct;

  // If cart checkout → use cart items
  const cart = useSelector((state) => state.orders.cart);

  const productsToOrder = buyNowProduct
    ? [
        {
          productId: buyNowProduct._id,
          quantity: 1,
          price: buyNowProduct.price,
        },
      ]
    : cart.map((item) => ({
        productId: item._id,
        quantity: 1,
        price: item.price,
      }));

  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        { products: productsToOrder },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear cart only if it was a cart checkout
      if (!buyNowProduct) dispatch(clearCart());

      alert("Order placed successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <>
      <Header />
      <div className="checkout-page">
        <h1>Checkout</h1>

        {/* Show selected product(s) */}
        <div className="checkout-items">
          {buyNowProduct ? (
            <div className="checkout-item">
              <img src={buyNowProduct.image} alt="" />
              <p>{buyNowProduct.name}</p>
              <p>₹{buyNowProduct.price}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="checkout-item" key={item._id}>
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>₹{item.price}</p>
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

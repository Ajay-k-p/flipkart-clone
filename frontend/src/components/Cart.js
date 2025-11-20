import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/orderSlice';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const cart = useSelector(state => state.orders.cart);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleBuyNow = async () => {
    try {
      const products = cart.map(item => ({
        productId: item._id,
        quantity: 1,
        price: item.price
      }));

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        { products },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(clearCart());
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-msg">Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img
                className="cart-img"
                src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                alt={item.name}
                onError={(e) => { e.target.src = "/placeholder-image.png"; }}
              />

              <div className="cart-info">
                <h3 className="cart-name">{item.name}</h3>
                <p className="cart-price">₹{item.price}</p>
              </div>
            </div>
          ))}

          <button className="buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

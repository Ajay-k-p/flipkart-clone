import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/orderSlice';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    if (product.quantity <= 0) {
      alert("Product is out of stock!");
      return;
    }

    dispatch(addToCart(product));
  };

  const handleBuyNow = () => {
    if (!token) {
      alert("Please login to buy products");
      navigate("/login");
      return;
    }

    if (product.quantity <= 0) {
      alert("Product is out of stock!");
      return;
    }

    navigate("/checkout", { state: { buyNowProduct: product } });
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-img"
        onError={(e) => { e.target.src = '/placeholder-image.png'; }}
      />

      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <p className="product-qty">Stock: {product.quantity}</p>

      <button className="add-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>

      <button className="buy-btn" onClick={handleBuyNow}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/orderSlice';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // 🚫 FIX BLINKING — store final image only once
  const [finalImage] = useState(product?.image || '/placeholder-image.png');

  const handleAddToCart = () => {
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    if (Number(product.quantity) <= 0) {
      alert("Product is out of stock!");
      return;
    }

    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: finalImage,
      quantity: 1,
      stock: Number(product.quantity)
    }));
  };

  const handleBuyNow = () => {
    if (!token) {
      alert("Please login to buy products");
      navigate("/login");
      return;
    }

    if (Number(product.quantity) <= 0) {
      alert("Product is out of stock!");
      return;
    }

    navigate("/checkout", { state: { buyNowProduct: product } });
  };

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      {Number(product.quantity) <= 0 && (
        <span className="out-of-stock-badge">OUT OF STOCK</span>
      )}

      <img
        src={finalImage}
        alt={product.name}
        className="product-img"
        onError={(e) => {
          // FIX: error only once
          if (!e.target.dataset.error) {
            e.target.dataset.error = "true";
            e.target.src = "/placeholder-image.png";
          }
        }}
      />

      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <p className="product-qty">Stock: {product.quantity}</p>

      <button
        className="add-btn"
        onClick={handleAddToCart}
        disabled={Number(product.quantity) <= 0}
      >
        {Number(product.quantity) <= 0 ? "Out of stock" : "Add to Cart"}
      </button>

      <button
        className="buy-btn"
        onClick={handleBuyNow}
        disabled={Number(product.quantity) <= 0}
      >
        {Number(product.quantity) <= 0 ? "Out of stock" : "Buy Now"}
      </button>
    </div>
  );
};

export default ProductCard;

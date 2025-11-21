import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice";
import axios from "axios";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const { list: products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const location = useLocation();

  const [filtered, setFiltered] = useState([]);

  // Extract search query (if exists)
  const query =
    new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  // ⭐ Reusable product fetch function
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products`
      );
      dispatch(setProducts(res.data));
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  // ⭐ Fetch products when page initially opens
  useEffect(() => {
    fetchProducts();
  }, []); // only once

  // ⭐ Refresh when user comes back from checkout page
  // (React updates location.key whenever the page changes)
  useEffect(() => {
    fetchProducts();
  }, [location.key]);

  // ⭐ Apply search filtering
  useEffect(() => {
    if (!query) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(query)
        )
      );
    }
  }, [query, products]);

  return (
    <>
      <Header />

      <div className="product-page">
        <h1 className="product-title">
          {query ? `Search Results for: "${query}"` : "Our Products"}
        </h1>

        <div className="product-grid">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;

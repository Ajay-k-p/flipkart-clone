import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

const Header = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const cart = useSelector((state) => state.orders.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${search}`);
  };

  return (
    <header className="header">

      {/* LEFT SECTION — LOGO */}
      <div className="left-section">

        {/* LOGO → Flip Mart */}
        <Link to="/" className="logo">Flip Mart</Link>

        {/* ABOUT PAGE */}
        <Link to="/about" className="about-link">About</Link>
      </div>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for products, brands and more"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* RIGHT SIDE NAVIGATION */}
      <nav className="right-section">

        {/* ⭐ NEW HOME BUTTON ⭐ */}
        <Link to="/" className="nav-link">Home</Link>

        {user ? (
          <>
            <span className="welcome">Hi, {user.name}</span>

            {/* CART WITH BADGE */}
            <div className="cart-wrapper">
              <Link to="/cart" className="nav-link cart-link">Cart</Link>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </div>

            {/* ADMIN OR USER DASHBOARD */}
            {user.role === "admin" ? (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            ) : (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}

            {/* LOGOUT */}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>

    </header>
  );
};

export default Header;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./Login.css"; // <-- IMPORT THE NEW CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );

      if (res.data.user && res.data.token) {
        dispatch(login({ user: res.data.user, token: res.data.token }));
        navigate(res.data.user.role === "admin" ? "/admin" : "/");
      } else {
        alert("Login succeeded, but user data is incomplete.");
      }
    } catch (err) {
      alert(
        `Login failed: ${
          err.response?.data?.message || "Invalid credentials or server error"
        }`
      );
    }
  };

  return (
    <>
      <Header />

      <div className="login-container">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2 className="login-title">Welcome Back 👋</h2>

          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="login-footer">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;

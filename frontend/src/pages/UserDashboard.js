import { useSelector } from "react-redux";
import Header from "../components/Header";
import OrderTracking from "../components/OrderTracking";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1 className="dashboard-title">User Dashboard</h1>
          <p className="dashboard-welcome">Welcome, <span>{user?.name}</span> 👋</p>

          <div className="dashboard-section">
            <OrderTracking />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // ❌ Admin check (fix here)
  if (adminOnly && role !== "admin") {
    console.log("Access denied. Role:", role); // 👈 debug
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
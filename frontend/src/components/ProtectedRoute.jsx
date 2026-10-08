import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page">
        <div className="container empty"><span className="spinner" /> Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/login" state={{ from: location.pathname, forceLogin: true }} replace />;
    }
    return <Navigate to={user?.role === "admin" ? "/admin" : "/investor"} replace />;
  }

  return children;
}

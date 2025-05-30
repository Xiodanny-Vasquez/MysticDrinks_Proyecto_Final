import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { token, user } = useContext(AuthContext);

  // Validar si está autenticado y es admin
  if (!token) return <Navigate to="/account" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;

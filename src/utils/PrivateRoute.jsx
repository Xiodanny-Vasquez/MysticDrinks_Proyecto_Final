import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // ✅ usamos el hook

const PrivateRoute = ({ children }) => {
  const { token } = useAuth(); // ✅ usamos el hook personalizado

  return token ? children : <Navigate to="/account" replace />;
};

export default PrivateRoute;

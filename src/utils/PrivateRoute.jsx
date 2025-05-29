import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext); // ✅ más limpio y reactivo

  return token ? children : <Navigate to="/account" replace />;
};

export default PrivateRoute;

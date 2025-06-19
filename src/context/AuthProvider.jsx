import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading mientras validamos

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    const validateSession = async () => {
      if (storedToken && storedUser) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { token: storedToken },
          });

          if (!res.ok) throw new Error("Token inválido o expirado");

          const freshUser = await res.json();
          setToken(storedToken);
          setUser(freshUser);
        } catch (err) {
          console.warn("⚠️ Sesión inválida, cerrando sesión...");
          logout();
        }
      }

      setLoading(false); // ✅ ocultar "cargando"
    };

    validateSession();
  }, []);

  const login = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

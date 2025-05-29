import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link } from "react-router-dom";

import "./Login.css";
import imgLogo from "../../assets/logo-mystic.png";
import googleIcon from "../../assets/google-icon.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useContext(AuthContext);

  // Función para iniciar sesión con Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtener info usuario desde Google
        const resGoogleUser = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const googleUser = resGoogleUser.data;

        // Enviar token al backend para login / registro
        const resBackend = await axios.post("/api/auth/google", {
          token: tokenResponse.access_token,
        });

        const { token, user } = resBackend.data;
        login(user, token); // Actualizar contexto con user y token

        // Redireccionar según rol
        window.location.href = user.role === "admin" ? "/admin" : "/";
      } catch (error) {
        console.error("Error al iniciar sesión con Google", error);
        setErrorMsg("Error al iniciar sesión con Google");
      }
    },
    onError: () => {
      setErrorMsg("Error al iniciar sesión con Google");
    },
  });

  // Login tradicional con email y contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data;

      login(user, token); // Actualizar contexto

      window.location.href = user.role === "admin" ? "/admin" : "/";
    } catch (error) {
      setErrorMsg("Credenciales inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src={imgLogo} alt="Logo de Mystic Drinks" />
        </div>
        <div className="login-content">
          <h2>Entrada exclusiva</h2>

          {/* Mostrar mensaje de error */}
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {/* Formulario tradicional */}
          <form onSubmit={handleSubmit}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn">
              Ingresar
            </button>
          </form>

          {/* Login con Google */}
          <div className="google-login">
            <img
              src={googleIcon}
              alt="Iniciar sesión con Google"
              style={{ width: "40px", cursor: "pointer", marginTop: "10px" }}
              onClick={() => loginWithGoogle()}
            />
          </div>

          <br />

          {/* Link para ir al registro */}
          <Link to="/register" className="toggle-link">
            Nuevo Usuario
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
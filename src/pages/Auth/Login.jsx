import React, { useState } from "react";
import "./Login.css";
import imgLogo from "../../assets/logo-mystic.png";
import googleIcon from "../../assets/google-icon.png";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState(""); // cambio nombre a email porque es mejor para login
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Login con Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtener datos de usuario desde Google
        const resGoogleUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = resGoogleUser.data;

        // Enviar token al backend para validar y obtener token JWT y rol
        const resBackend = await axios.post("/api/auth/google", { token: tokenResponse.access_token });
        const { token, user } = resBackend.data;

        // Guardar token y datos usuario
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirigir según rol
        if (user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error al iniciar sesión con Google", error);
        setErrorMsg("Error al iniciar sesión con Google");
      }
    },
    onError: () => {
      setErrorMsg("Error al iniciar sesión con Google");
    },
  });

  // Login con email y password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
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

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

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

          <div className="google-login">
            <p style={{ marginTop: "20px" }}></p>
            <img
              src={googleIcon}
              alt="Iniciar sesión con Google"
              style={{ width: "40px", cursor: "pointer", marginTop: "10px" }}
              onClick={() => loginWithGoogle()}
            />
          </div>

          <br />
          <Link to="/register" className="toggle-link">
            Nuevo Usuario
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

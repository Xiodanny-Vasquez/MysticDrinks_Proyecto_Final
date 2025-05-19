import React from "react";
import "./Login.css";
import imgLogo from "../../assets/logo-mystic.png";
import googleIcon from "../../assets/google-icon.png"; // Asegúrate de tener esta imagen
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login({ onToggle }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const decoded = jwtDecode(tokenResponse.credential);
      console.log("Usuario autenticado:", decoded);
      localStorage.setItem("user", JSON.stringify(decoded));
      window.location.href = "/";
    },
    onError: () => {
      console.error("Error al iniciar sesión con Google");
    },
    flow: "implicit", // importante para usar credential
  });

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src={imgLogo} alt="Logo de Mystic Drinks" />
        </div>
        <div className="login-content">
          <h2>Entrada exclusiva</h2>
          <form>
            <label>Nombre</label>
            <input type="text" placeholder="Nombre" />
            <label>Contraseña</label>
            <input type="password" placeholder="Contraseña" />
            <button type="submit" className="login-btn">
              Ingresar
            </button>
          </form>

          <div className="google-login" style={{ marginTop: "20px" }}>
            <img
              src={googleIcon}
              alt="Iniciar sesión con Google"
              style={{ width: "40px", cursor: "pointer" }}
              onClick={() => login()}
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

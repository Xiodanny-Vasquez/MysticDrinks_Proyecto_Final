import React from "react";
import "./Login.css";
import imgLogo from "../../assets/logo-mystic.png";
import googleIcon from "../../assets/google-icon.png";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtener datos del usuario desde Google
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userData = res.data;
        console.log("Usuario autenticado:", userData);

        // Guardar usuario en localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Redireccionar al inicio
        window.location.href = "/";
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    },
    onError: () => {
      console.error("Error al iniciar sesión con Google");
    },
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

import React from "react";
import "./Login.css";
import imgLogo from "../../assets/logo-elixir.png";
import { Link } from "react-router-dom";

function Login({ onToggle }) {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src={imgLogo} alt="Logo de Elixir Drinks" />
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
          <Link to="/register" className="toggle-link">
            Nuevo Usuario
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

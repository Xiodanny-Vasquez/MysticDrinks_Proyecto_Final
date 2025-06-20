import React, { useState } from "react";
import "./Login.css";
import imgLogo from "../../assets/logo-mystic.png";
import googleIcon from "../../assets/google-icon.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { supabase } from "../../context/supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();

  const handleRedirectByRole = (rol) => {
    window.location.href = rol === "admin" ? "/admin" : "/";
  };

  // ✅ Login con Google (redirige a /oauth-callback)
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/oauth-callback`,
      },
    });

    if (error) {
      console.error("Error al redirigir a Google:", error.message);
      setErrorMsg("Error al iniciar sesión con Google.");
    }
  };

  // ✅ Login con email y contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {

      const normalizedEmail = email.trim().toLowerCase();
      const providerCheck = await axios.get(
        `/api/auth/provider?email=${encodeURIComponent(normalizedEmail)}`
      );
      const { isGoogleUser } = providerCheck.data;

      if (isGoogleUser) {
        setErrorMsg("Este correo fue registrado con Google. Inicia sesión con el botón de Google.");
        return;
      }

      // Si es usuario registrado manualmente, continuar con login
        const res = await axios.post("/api/auth/login",  {
        email: normalizedEmail,
        password,
      });
        
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        login(user, token);

        handleRedirectByRole(user.rol);
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);

        if (error.response?.status === 404) {
        setErrorMsg("No encontramos un usuario con este correo. ¿Registrado con Google?");
        }
         else if (error.response?.status === 401) {
          setErrorMsg("Correo o contraseña incorrectos. Intenta de nuevo.");
        } else {
          setErrorMsg("Ocurrió un error al iniciar sesión. Intenta más tarde.");
        }
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

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
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

          <p className="forgot-password-link">
          <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
          </p>

          <div className="google-login" onClick={handleGoogleLogin}>
            <img
              src={googleIcon}
              alt="Iniciar sesión con Google"
              className="google-icon"
            />
          </div>

          <Link to="/register" className="toggle-link">
            ¿Nuevo usuario? Regístrate aquí ahora
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import "./Register.css";
import imgRegister from "../../assets/Register.jpg";
import googleIcon from "../../assets/google-icon.png";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  // Estados
  const [edad, setEdad] = useState("");
  const [numeroDeIdentificacion, setNumeroDeIdentificacion] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Errores
  const [errors, setErrors] = useState({
    edad: "",
    numeroDeIdentificacion: "",
    name: "",
    email: "",
    password: "",
    general: "",
  });

  // Validaciones
  const isEdadValida = !isNaN(edad) && parseInt(edad) >= 18;
  const isNumeroDeIdentificacionValido = numeroDeIdentificacion.trim().length >= 6;

  // Login con Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post("http://localhost:4000/api/auth/google", {
          token: tokenResponse.credential || tokenResponse.access_token,
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/account");
      } catch (error) {
        console.error("Error al registrar con Google:", error);
      }
    },
    onError: () => console.log("Error al registrar con Google"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      edad: "",
      numeroDeIdentificacion: "",
      name: "",
      email: "",
      password: "",
      general: "",
    };

    let hasError = false;

    if (!edad.trim()) {
      newErrors.edad = "La edad es obligatoria.";
      hasError = true;
    } else if (!isEdadValida) {
      newErrors.edad = "Debes ser mayor de 18 años para registrarte.";
      hasError = true;
    }

    if (isEdadValida && !isNumeroDeIdentificacionValido) {
      newErrors.numeroDeIdentificacion =
        "El número de identificación debe tener al menos 6 caracteres.";
      hasError = true;
    }

    if (isEdadValida && isNumeroDeIdentificacionValido) {
      if (!name.trim()) {
        newErrors.name = "El nombre es obligatorio.";
        hasError = true;
      }
      if (!email.trim()) {
        newErrors.email = "El correo es obligatorio.";
        hasError = true;
      }
      if (!password.trim()) {
        newErrors.password = "La contraseña es obligatoria.";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        name,
        edad: parseInt(edad),
        numero_de_identificacion: numeroDeIdentificacion,
        email,
        password,
      });
      navigate("/account");
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Este correo ya está registrado." }));
      } else {
        setErrors((prev) => ({ ...prev, general: "Error al registrar. Intenta de nuevo." }));
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-form">
          <h2>Haz parte de nuestra Barra Exclusiva</h2>
          <form onSubmit={handleSubmit}>
            {/* Edad */}
            <label>Edad</label>
            <input
              type="number"
              placeholder="Edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
            />
            {errors.edad && <p className="error-msg">{errors.edad}</p>}

            {!isEdadValida && edad && (
              <p className="error-msg">
                Debes ser mayor de 18 años para continuar con el registro.
              </p>
            )}

            {/* Número de identificación */}
            <label>Número de identificación</label>
            <input
              type="text"
              placeholder="Número de identificación"
              value={numeroDeIdentificacion}
              onChange={(e) => setNumeroDeIdentificacion(e.target.value)}
              required
              disabled={!isEdadValida}
            />
            {errors.numeroDeIdentificacion && (
              <p className="error-msg">{errors.numeroDeIdentificacion}</p>
            )}

            {/* Nombre */}
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={!isEdadValida}
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}

            {/* Correo */}
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isEdadValida}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            {/* Contraseña */}
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!isEdadValida}
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}

            {/* Botón */}
            <button type="submit" className="register-btn" disabled={!isEdadValida}>
              Unirme
            </button>

            {errors.general && <p className="error-msg">{errors.general}</p>}

            {/* Google login */}
            <div
              style={{ marginTop: "1rem", cursor: "pointer", textAlign: "center" }}
              onClick={() => loginWithGoogle()}
            >
              <img src={googleIcon} alt="Google login" className="google-icon" />
            </div>
          </form>
        </div>

        {/* Imagen lateral */}
        <div className="register-image">
          <img src={imgRegister} alt="Coctel humeante" />
        </div>
      </div>
    </div>
  );
}

export default Register;
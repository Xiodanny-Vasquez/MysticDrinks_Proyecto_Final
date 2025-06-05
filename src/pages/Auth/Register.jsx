import React, { useState } from "react";
import "./Register.css";
import imgRegister from "../../assets/Register.jpg";
import googleIcon from "../../assets/google-icon.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../context/supabaseClient";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    edad: "",
    numeroDeIdentificacion: "",
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdadValida = !isNaN(formData.edad) && parseInt(formData.edad) >= 18;
  const isNumeroDeIdentificacionValido =
    formData.numeroDeIdentificacion.trim().length >= 6;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const { edad, numeroDeIdentificacion, name, email, password } = formData;

    if (!edad.trim()) newErrors.edad = "La edad es obligatoria.";
    else if (!isEdadValida)
      newErrors.edad = "Debes tener al menos 18 años para registrarte.";

    if (!numeroDeIdentificacion.trim()) {
      newErrors.numeroDeIdentificacion = "El número de identificación es obligatorio.";
    } else if (!isNumeroDeIdentificacionValido) {
      newErrors.numeroDeIdentificacion =
        "El número debe tener al menos 6 caracteres.";
    }

    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!email.trim()) newErrors.email = "El correo es obligatorio.";
    if (!password.trim()) newErrors.password = "La contraseña es obligatoria.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);
  try {
    // 🔍 Verificar si ya existe y fue registrado con Google
    const providerCheck = await axios.get(
      `/api/auth/provider?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`
    );

    const { exists, isGoogleUser } = providerCheck.data;

    
    if (exists && isGoogleUser) {
    setErrors({ email: "Este correo ya está registrado con Google. Usa el botón de Google para iniciar sesión." });
    setIsSubmitting(false);
   return;
}

    // 🚀 Registro manual
    await axios.post("/api/auth/register", {
      name: formData.name.trim(),
      edad: parseInt(formData.edad),
      numero_de_identificacion: formData.numeroDeIdentificacion.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    navigate("/account");
  } catch (error) {
    if (error.response?.status === 409) {
      setErrors({ email: "Este correo ya está registrado." });
    } else {
      setErrors({ general: "Error al registrar. Intenta de nuevo." });
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000/oauth-callback", // ⚠️ Ajusta esto según tu dominio de frontend
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err.message);
      setErrors((prev) => ({
        ...prev,
        general: "Error al iniciar sesión con Google. Intenta nuevamente.",
      }));
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-form">
          <h2>Haz parte de nuestra Barra Exclusiva</h2>
          <form onSubmit={handleSubmit}>
            <label>Edad</label>
            <input
              type="number"
              name="edad"
              placeholder="Edad"
              value={formData.edad}
              onChange={handleChange}
              required
            />
            {errors.edad && <p className="error-msg">{errors.edad}</p>}

            <label>Número de identificación</label>
            <input
              type="text"
              name="numeroDeIdentificacion"
              placeholder="Número de identificación"
              value={formData.numeroDeIdentificacion}
              onChange={handleChange}
              required
            />
            {errors.numeroDeIdentificacion && (
              <p className="error-msg">{errors.numeroDeIdentificacion}</p>
            )}

            <label>Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}

            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}

            <button type="submit" className="register-btn" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Unirme"}
            </button>

            {errors.general && <p className="error-msg">{errors.general}</p>}

            <div
              style={{
                marginTop: "1rem",
                cursor: "pointer",
                textAlign: "center",
              }}
              onClick={loginWithGoogle}
            >
              <img src={googleIcon} alt="Google login" className="google-icon" />
              <p>Registrarme con Google</p>
            </div>
          </form>
        </div>

        <div className="register-image">
          <img src={imgRegister} alt="Coctel humeante" />
        </div>
      </div>
    </div>
  );
}

export default Register;

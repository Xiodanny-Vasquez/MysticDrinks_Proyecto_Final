import React, { useState } from 'react';
import './Register.css';
import imgRegister from '../../assets/Register.jpg';
import googleIcon from '../../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  const [edad, setEdad] = useState('');
  const [numeroDeIdentificacion, setNumeroDeIdentificacion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    edad: '',
    numeroDeIdentificacion: '',
    name: '',
    email: '',
    password: '',
    general: '',
  });

  const isEdadValida = !isNaN(edad) && parseInt(edad) >= 18;
  // Número de identificación válido solo si tiene mínimo 6 caracteres
  const isNumeroDeIdentificacionValido = numeroDeIdentificacion.trim().length >= 6;

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google', {
          token: tokenResponse.credential || tokenResponse.access_token,
        });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/account');
      } catch (error) {
        console.error('Error al registrar con Google:', error);
      }
    },
    onError: () => console.log('Error al registrar con Google'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      edad: '',
      numeroDeIdentificacion: '',
      name: '',
      email: '',
      password: '',
      general: '',
    };

    let hasError = false;

    // Validar edad
    if (!edad.trim()) {
      newErrors.edad = 'La edad es obligatoria.';
      hasError = true;
    } else if (isNaN(edad) || parseInt(edad) < 18) {
      newErrors.edad = 'Debes ser mayor de 18 años para registrarte.';
      hasError = true;
    }

    // Validar número de identificación solo si edad es válida
    if (isEdadValida) {
      if (numeroDeIdentificacion.trim().length < 6) {
        newErrors.numeroDeIdentificacion = 'El número de identificación debe tener al menos 6 caracteres.';
        hasError = true;
      }
    }

    // Validar otros campos solo si número de identificación es válido
    if (isEdadValida && isNumeroDeIdentificacionValido) {
      if (!name.trim()) {
        newErrors.name = 'El nombre es obligatorio.';
        hasError = true;
      }
      if (!email.trim()) {
        newErrors.email = 'El correo es obligatorio.';
        hasError = true;
      }
      if (!password.trim()) {
        newErrors.password = 'La contraseña es obligatoria.';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        edad: parseInt(edad),
        numero_de_identificacion: numeroDeIdentificacion,
        email,
        password,
      });
      navigate('/account'); // Redirigir a la página de inicio de sesión después del registro exitoso
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: 'Este correo ya está registrado.' }));
      } else {
        setErrors((prev) => ({ ...prev, general: 'Error al registrar. Intenta de nuevo.' }));
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
              <p className="error-msg">Debes ser mayor de 18 años para continuar.</p>
            )}

            {/* Número de identificación, solo si la edad es válida */}
            {isEdadValida && (
              <>
                <label>Número de identificación</label>
                <input
                  type="text"
                  placeholder="Número de identificación"
                  value={numeroDeIdentificacion}
                  onChange={(e) => setNumeroDeIdentificacion(e.target.value)}
                  required
                />
                {errors.numeroDeIdentificacion && (
                  <p className="error-msg">{errors.numeroDeIdentificacion}</p>
                )}
              </>
            )}

            {/* Otros campos, solo si número de identificación es válido (>=6 caracteres) */}
            {isEdadValida && isNumeroDeIdentificacionValido && (
              <>
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {errors.name && <p className="error-msg">{errors.name}</p>}

                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="error-msg">{errors.email}</p>}

                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="error-msg">{errors.password}</p>}

                <button type="submit" className="register-btn">
                  Unirme
                </button>

                {errors.general && <p className="error-msg">{errors.general}</p>}

                <div
                  style={{ marginTop: '1rem', cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => loginWithGoogle()}
                >
                  <img src={googleIcon} alt="Google login" className="google-icon" />
                </div>
              </>
            )}
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

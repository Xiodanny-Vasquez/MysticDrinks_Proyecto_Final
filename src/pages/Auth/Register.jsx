// === frontend/src/pages/Register.jsx ===
import React, { useState } from 'react';
import './Register.css';
import imgRegister from '../../assets/Register.jpg';
import googleIcon from '../../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', general: '' });

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google', {
          token: tokenResponse.credential || tokenResponse.access_token,
        });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/bienvenido');
      } catch (error) {
        console.error('Error al registrar con Google:', error);
      }
    },
    onError: () => console.log('Error al registrar con Google'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { name: '', email: '', password: '', general: '' };

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

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      navigate('/account');
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
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}

            <button type="submit" className="register-btn">Unirme</button>
            {errors.general && <p className="error-msg">{errors.general}</p>}
          </form>
          <div
            style={{ marginTop: '1rem', cursor: 'pointer', textAlign: 'center' }}
            onClick={() => loginWithGoogle()}
          >
            <img src={googleIcon} alt="Google login" className="google-icon" />
          </div>
        </div>
        <div className="register-image">
          <img src={imgRegister} alt="Coctel humeante" />
        </div>
      </div>
    </div>
  );
}

export default Register;
import React from 'react';
import './Register.css';
import imgRegister from '../../assets/Register.jpg';

function Register() {
  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-form">
          <h2>Haz parte de nuestra Barra Exclusiva</h2>
          <form>
            <label>Nombre</label>
            <input type="text" placeholder="Nombre" required /> 
            <label>Correo electrónico</label>
            <input type="email" placeholder="Correo electrónico" required />
            <label>Edad</label>
            <input type="number" placeholder="edad" required />
            <label>Contraseña</label>
            <input type="password" placeholder="Contraseña" required />
            <button type="submit" className="register-btn">Unirme</button>
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

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css"; 

function CompleteProfile() {
  const [edad, setEdad] = useState("");
  const [dni, setDni] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/api/auth/oauth-register",
        { edad, numero_de_identificacion: dni },
        { headers: { token } }
      );
      navigate("/"); // o a /admin según el rol
    } catch (err) {
      console.error("Error al completar perfil:", err);
      setErrorMsg("No se pudo completar el perfil. Intenta de nuevo.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Completa tu perfil</h2>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <form onSubmit={handleSubmit}>
        <label>Edad:</label>
        <input
          type="number"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />

        <label>DNI o identificación:</label>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />

       <button type="submit" className="complete-btn">Guardar</button>
      </form>
    </div>
  );
}

export default CompleteProfile;

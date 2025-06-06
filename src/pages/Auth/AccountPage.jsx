import React from "react";
import { useAuth } from "../../context/AuthProvider";
import "./AccountPage.css"; // lo creamos en el paso 2

const AccountPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  return (
    <div className="account-container">
      <h2>Mi Perfil</h2>
      <div className="user-info">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Edad:</strong> {user.edad}</p>
        <p><strong>Identificación:</strong> {user.numero_de_identificacion}</p>
        <p><strong>Rol:</strong> {user.rol}</p>
        <p><strong>Registrado el:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AccountPage;

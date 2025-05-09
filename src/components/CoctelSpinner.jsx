import React from "react";
import './CoctelSpinner.css'

function CoctelSpinner() {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-50">
      <div className="cocktail-spinner" role="status">
        <span className="cocktail-emoji" aria-hidden="true">
          🍸
        </span>
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}

export default CoctelSpinner;

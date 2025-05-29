import React from 'react';
import './Ultimo.css';
import { Link } from "react-router-dom";

function UltimaSection() {
  return (
    <div className="ultima-section-new">
      <div className="glass-box">
        <div className="image-text-wrapper">
          <div className="image1-placeholder"></div>

          <div className="text-container">
            <h2>Despierta Tus Sentidos</h2>
            <p>
              Déjate llevar por una experiencia líquida que despierta emociones, 
              agita recuerdos y transforma lo cotidiano en extraordinario.
            </p>
            <p>
              Nuestros cócteles no solo se beben, se sienten: cada mezcla está diseñada
              para cautivar tus sentidos y llevarte a un viaje inolvidable.
            </p>
            <Link to="/Productos">
              <button className="cta-button">
                Descúbrelo Ahora
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UltimaSection;

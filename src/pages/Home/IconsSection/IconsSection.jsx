import React from "react";
import "./IconsSection.css";
import coctelIcon from "../../../assets/CoctelesP.png";
import ingredientesIcon from "../../../assets/Ingredientes.png";
import servicioIcon from "../../../assets/Servicio.png";

function IconsSection() {
  return (
    <div className="icons-section">
      <div className="icon-item">
        <img
          src={coctelIcon}
          alt="Cócteles personalizados"
          className="icon-image"
        />
        <p>Cócteles <br />personalizados</p>
      </div>
      <div className="icon-item ">
        <img
          src={ingredientesIcon}
          alt="Ingredientes selectos"
          className="icon-image"
        />
        <p >Ingredientes <br /> selectos</p>
      </div>
      <div className="icon-item">
        <img
          src={servicioIcon}
          alt="Servicio de entrega premium"
          className="icon-image"
        />
        <p>Servicio de <br />entrega premium</p>
      </div>
    </div>
  );
}

export default IconsSection;

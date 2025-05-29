import React from "react";
import { Container } from "react-bootstrap";
import imgCocktail from "../../../assets/Cocktail.jpg";
import "./Body.css";

function Body() {
  return (
    <div className="Body">
      <Container className="Container-sup">
        <div>
          <p>
            Bienvenidos a un rincón donde cada cóctel es una obra maestra. En{" "}
            <strong> MYSTIC DRINKS</strong>, nuestra misión es elevar cada momento con
            una mezcla perfecta de sabores, aromas y detalles que transforman
            una bebida en una experiencia inolvidable.
          </p>
          <hr className="divider" />
        </div>

        <img src={imgCocktail} alt="Coctel parte derecha" />
      </Container>
      <Container className="Container-inf">
        <p>
          Cada cóctel que ofrecemos está inspirado en nuestra pasión por la
          coctelería, con ingredientes frescos, técnicas innovadoras y la
          dedicación de un equipo que valora la excelencia en cada vaso. Nos
          esforzamos en ofrecer combinaciones que sorprendan y encanten, desde
          las clásicas mezclas hasta nuestras propias creaciones, pensadas para
          satisfacer todos los gustos.
        </p>

        <h3>
          "Un buen coctel no solo debe disfrutarse, <br /> sino tambien
          compartirse."
        </h3>
        
        <hr className="divider" />
      </Container>
      <div className="division"></div>
    </div>
  );
}

export default Body;

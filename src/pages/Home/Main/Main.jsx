import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Main.css";
import imgAmarillo from "../../../assets/CoctelAmarillo.jpg";
import imgCafe from "../../../assets/coctelCafé.jpg";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 main-background">
      <div className="row text-center w-75">
        <div className="col-md-4 d-flex justify-content-center align-items-center image-placeholder">
          <img src={imgAmarillo} alt="Coctel Naranja" className="image" />
        </div>
        <div className="col-md-4 text-content">
          <h1 className="title">El Arte de la Mixología</h1>
          <p className="paragraph">
            Inspirados en la tradición, creamos cócteles que elevan cada
            momento.
          </p>
          <p className="paragraph">
            Innovación y pasión en cada copa.
          </p>
          <Link to="/quiz">
            <button className="btn btn-custom">
              Encuentra el perfecto para ti
            </button>
          </Link>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center image-placeholder">
          <img src={imgCafe} alt="Coctel Café" className="image" />
        </div>
      </div>
    </div>
  );
}

export default Main;

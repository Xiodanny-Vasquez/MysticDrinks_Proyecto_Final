import React from "react";
import "./Card.css";

function Cards(props) {
  return (
    <div className="card-name">
      <h2>{props.name}</h2>
    </div>
  );
}

export default Cards;

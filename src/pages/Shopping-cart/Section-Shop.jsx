import React from "react";
import "./SectionShop.css";
import { Container } from "react-bootstrap";
import Cart from "./Cart";
import Summary from "./Components/Summary";

function SectionShop() {
  return (
    <div>
      <Container className="Section-sup">
        <h1>Tu bandeja de cocteles</h1>
        <hr className="divider" />
      </Container>

      <Container className="body">
        <div className="body-shop-cart">
          <div className="Header">
            <p>Coctel</p>
            <p className="set-right">Cantidad</p>
            <p>Precio</p>
          </div>
          <div className="shop-cart">
            <Cart />
            <div className="section-summary">
              <Summary />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SectionShop;

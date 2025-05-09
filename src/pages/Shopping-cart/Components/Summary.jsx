import React from "react";
import { Container } from "react-bootstrap";
import "./Summary.css";
import CartSummary from "./CartSummary";

function Summary() {
  return (
    <div>
      <Container>
        <CartSummary/>
      </Container>
    </div>
  );
}

export default Summary;

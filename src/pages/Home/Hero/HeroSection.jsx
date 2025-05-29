import React, { useEffect } from "react";
import "./Hero.css";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Carousel from "../Carrusel/Carousel";
import anime from "animejs";



function HeroSection() {
  useEffect(() => {
    anime({
      targets: ".circle",
      duration: 1000,
      easing: "easeInOutQuad",
    });
  }, []);

  return (
    <div className="hero-section w-auto text-white text-center">
      <Container>
        <h1 className="title-animated">MYSTIC DRINKS</h1>
        <p className="lead fs-4">Donde cada trago cuenta una historia.</p>
        <Carousel />
        <Link to="/Productos">
          <Button className="btn btn-secondary" size="lg">
            Explora nuestros cocteles exclusivos
          </Button>
        </Link>
      </Container>
    </div>
  );
}

export default HeroSection;

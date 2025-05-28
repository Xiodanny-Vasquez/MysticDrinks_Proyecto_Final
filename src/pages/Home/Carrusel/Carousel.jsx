import React, { useEffect, useState, useRef } from "react";
import { fetchLimitedCocktails } from "../../../services/cocktailAPI";
import { Link } from "react-router-dom";
import "./Carousel.css";

function Carousel() {
  const [cocktails, setCocktails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Generar precio aleatorio en peso
  const generateRandomPriceCOP = () => {
    const randomNumber = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
    return randomNumber.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLimitedCocktails(5);

        // Agregar precios aleatorios a cada cóctel
        const cocktailsWithPrices = data.map((cocktail) => ({
          ...cocktail,
          price: generateRandomPriceCOP(),
        }));

        setCocktails(cocktailsWithPrices);
      } catch (error) {
        console.error("Error cargando cócteles:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cocktails.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [cocktails]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cocktails.length);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cocktails.length) % cocktails.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cocktails.length);
  };

  const getSlideClass = (index) => {
    if (index === currentIndex) return "slide active";
    if (index === (currentIndex - 1 + cocktails.length) % cocktails.length) return "slide left";
    if (index === (currentIndex + 1) % cocktails.length) return "slide right";
    return "slide hidden";
  };

  if (cocktails.length === 0) return <p>Cargando carrusel...</p>;

  return (
    <div
      className="coverflow-carousel"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <button className="nav left" onClick={prevSlide}>&#8249;</button>

      <div className="slides">
        {cocktails.map((cocktail, index) => (
          <div key={cocktail.idDrink} className={getSlideClass(index)}>
            <Link to={`/cocktail/${cocktail.idDrink}`} state={{ price: cocktail.price }}>
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="carousel1-img"
              />
              <p className="fw-bold text-white mb-0">{cocktail.strDrink}</p>
              
            </Link>
          </div>
        ))}
      </div>

      <button className="nav right" onClick={nextSlide}>&#8250;</button>
    </div>
  );
}

export default Carousel;

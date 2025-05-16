import React, { useEffect, useState, useRef } from "react";
import { fetchLimitedCocktails } from "../../../services/cocktailAPI";
import { Link } from "react-router-dom";
import "./Carousel.css";

function Carousel() {
  const [cocktails, setCocktails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLimitedCocktails(5);
        setCocktails(data);
      } catch (error) {
        console.error("Error cargando cócteles:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cocktails]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cocktails.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cocktails.length) % cocktails.length);
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
      <div className="slides">
        {cocktails.map((cocktail, index) => (
          <div key={cocktail.idDrink} className={getSlideClass(index)}>
            <Link to={`/cocktail/${cocktail.idDrink}`} state={{ price: "$15.00" }}>
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="carousel1-img"
              />
              <p>{cocktail.strDrink}</p>
            </Link>
          </div>
        ))}
      </div>
      <button
        className="nav left"
        onClick={(e) => {
          e.preventDefault();
          prevSlide();
        }}
      >
        &#8249;
      </button>
      <button
        className="nav right"
        onClick={(e) => {
          e.preventDefault();
          nextSlide();
        }}
      >
        &#8250;
      </button>
    </div>
  );
}

export default Carousel;

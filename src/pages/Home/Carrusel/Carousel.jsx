import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCocktails } from '../../../services/cocktailAPI';
import './Carousel.css';

export const Carousel1 = () => {
  const navigate = useNavigate();
  const [cocktails, setCocktails] = useState([]);
  const [current, setCurrent] = useState(2);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchCocktails(["margarita", "daiquiri", "mojito", "bloody mary", "pina colada"]);
      setCocktails(result);
    };
    loadData();
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + cocktails.length) % cocktails.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % cocktails.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [cocktails, current]);

  const handleClick = (idDrink) => {
    navigate(`/cocktail/${idDrink}`);
  };

  if (!cocktails.length) return null;

  return (
    <div className="coverflow-carousel">
      <button className="nav left" onClick={prevSlide}>‹</button>
      <div className="slides">
        {cocktails.map((card, i) => {
          const offset = i - current;
          let className = 'slide';
          if (offset === 0) className += ' active';
          else if (offset === -1 || offset === cocktails.length - 1) className += ' left';
          else if (offset === 1 || offset === -(cocktails.length - 1)) className += ' right';
          else className += ' hidden';

          return (
            <div
              key={card.idDrink}
              className={className}
              onClick={() => handleClick(card.idDrink)}
              style={{ cursor: 'pointer' }}
            >
              <img src={card.strDrinkThumb} alt={card.strDrink} className="carousel1-img" />
              <h3>{card.strDrink}</h3>
            </div>
          );
        })}
      </div>
      <button className="nav right" onClick={nextSlide}>›</button>
    </div>
  );
};

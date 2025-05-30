import React from "react";
import "./CoctelCard.css";
import { useCart } from "../pages/Shopping-cart/Hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CoctelCard = ({ cocktail }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleClick = () => {
    navigate(`/cocktail/${cocktail.idDrink}`, {
      state: { price: cocktail.price },
    });
  };

  const handleAddToCart = () => {
    addToCart(cocktail);
    toast.success(`✅ ¡${cocktail.strDrink} ha sido agregado al carrito!`);
  };

  return (
    <div className="cont">
      <div className="product-card">
        <div className="product-card__image" onClick={handleClick}>
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
        </div>
        <div className="product-card__info">
          <h2
            className="product-card__title text-truncate mb-3"
            onClick={handleClick}
          >
            {cocktail.strDrink}
          </h2>
          <div className="product-card__price-row">
            <span className="product-card__price" onClick={handleClick}>
              {cocktail.price || ""}
            </span>
            <button className="product-card__btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoctelCard;

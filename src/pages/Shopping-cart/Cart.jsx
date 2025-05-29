import React from "react";
import { useCart } from "./Hooks/useCart";
import CartItem from "./CartItem";

function Cart() {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();

  const handleAdd = (cocktail) => {
    addToCart({
      idDrink: cocktail.id,
      strDrink: cocktail.title,
      strDrinkThumb: cocktail.thumbnail,
      price: cocktail.price,
      quantity: 1,
    });
  };

  const handleSubtract = (cocktail) => {
    addToCart({
      idDrink: cocktail.id,
      strDrink: cocktail.title,
      strDrinkThumb: cocktail.thumbnail,
      price: cocktail.price,
      quantity: -1,
    });
  };

  return (
    <div>
      <ul>
        {cart.map((cocktail) => (
          <CartItem
            key={cocktail.id}
            addToCart={() => handleAdd(cocktail)}
            subtractFromCart={() => handleSubtract(cocktail)}
            removeFromCart={() => removeFromCart(cocktail.id)}
            {...cocktail}
          />
        ))}
      </ul>

      {cart.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="btn btn-secondary" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;

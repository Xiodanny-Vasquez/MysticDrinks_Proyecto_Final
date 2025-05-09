import React from "react";
import { useCart } from "./Hooks/useCart";

import CartItem from "./CartItem";
function Cart() {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();
  console.log(cart);
  return (
    <div>
      <ul>
        {cart.map((cocktail) => (
          <CartItem
            key={cocktail.id}
            addToCart={() => addToCart(cocktail)}
            removeFromCart={() => removeFromCart(cocktail.id)}
            {...cocktail}
          />
        ))}
      </ul>
    </div>
  );
}

export default Cart;

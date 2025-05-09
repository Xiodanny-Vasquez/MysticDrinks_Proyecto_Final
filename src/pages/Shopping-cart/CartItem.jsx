import React from "react";
import "./Cart.css";

function CartItem({ thumbnail, price, title, quantity, removeFromCart }) {
  //<Button onClick={addToCart}>+</Button>} debajo de 'quantity'
  return (
    <li className="cart">
      <img src={thumbnail} alt={title} />
      <h3>
        <strong>{title}</strong>
      </h3>
      <p>{quantity}</p>
      <p>{price}</p>
      <button onClick={removeFromCart}>x</button>
    </li>
  );
}
export default CartItem;

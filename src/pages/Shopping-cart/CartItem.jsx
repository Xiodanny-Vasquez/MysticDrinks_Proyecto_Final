import React from "react";
import "./Cart.css";

function CartItem({ thumbnail, price, title, quantity, addToCart, subtractFromCart, removeFromCart }) {
  return (
    <li className="cart">
      <img src={thumbnail} alt={title} />
      <h3><strong>{title}</strong></h3>

      <div className="quantity-controls">
        <button className="qty-btn" onClick={subtractFromCart}>−</button>
        <span className="qty-value">{quantity}</span>
        <button className="qty-btn" onClick={addToCart}>+</button>
      </div>

      <p>{price}</p>
      <button onClick={removeFromCart}>x</button>
    </li>
  );
}

export default CartItem;

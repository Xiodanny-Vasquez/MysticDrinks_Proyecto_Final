import React from "react";
import { useCart } from "../Hooks/useCart";
import "./Summary.css";
import IconoCarritoVacio from "../../../assets/balde.png"
// Función para calcular el total de un cocktail
const calculateTotal = (price, quantity) => {
  const Price = parseFloat(price.replace("$", "")) || 0;
  const Quantity = parseInt(quantity, 10) || 1;

  return Price * Quantity;
};

// Componente que muestra el resumen del carrito
function CartSummary() {
  const { cart } = useCart();

  // Función para calcular el total final sumando el total de todos los productos
  const calculateGrandTotal = () => {
    return cart.reduce((accumulateTotal, cocktail) => {
      return (
        accumulateTotal + calculateTotal(cocktail.price, cocktail.quantity)
      );
    }, 0);
  };

  // Mostrar un mensaje si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img src={IconoCarritoVacio} alt="Carrito vacío" className="empty-cart-image" />
        <p className="empty-cart-text">El carrito está vacío.</p>
      </div>
    );
  }

  const grandTotal = calculateGrandTotal();
  return (
    <div className="card-summary">
      <h2>Resumen</h2>
      <ul>
        {cart.map((cocktail) => (
          <CartItem key={cocktail.id} cocktail={cocktail} />
        ))}
      </ul>
      <hr className="divider" />
      <h3 className="total-price">Total Final: ${grandTotal.toFixed(2)}</h3>
    </div>
  );
}

// Componente para representar un item del carrito
function CartItem({ cocktail }) {
  const total = calculateTotal(cocktail.price, cocktail.quantity);

  return (
    <li className="lista">
      <p className="name-product">{cocktail.title}</p>
      <p className="Price-product">${total.toFixed(2)}</p>
    </li>
  );
}

export default CartSummary;

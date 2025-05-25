import React from "react";
import { useCart } from "../Hooks/useCart";
import { useNavigate } from "react-router-dom";
import "./Summary.css";
import IconoCarritoVacio from "../../../assets/balde.png";

const calculateTotal = (price, quantity) => {
  const Price = parseFloat(price.replace("$", "")) || 0;
  const Quantity = parseInt(quantity, 10) || 1;
  return Price * Quantity;
};

function CartSummary() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const calculateGrandTotal = () => {
    return cart.reduce((acc, cocktail) => {
      return acc + calculateTotal(cocktail.price, cocktail.quantity);
    }, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img
          src={IconoCarritoVacio}
          alt="Carrito vacío"
          className="empty-cart-image"
        />
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

      {/* ✅ Botón para ir a Datos de Entrega */}
      <button
        className="confirm-button"
        onClick={() => navigate("/datos-entrega")}
      >
        Confirmar compra
      </button>
    </div>
  );
}

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

import React from "react";
import { useCart } from "./Hooks/useCart"; // usamos tu hook personalizado
import "./DatosEntrega.css";

const DatosEntrega = () => {
    const { cart } = useCart();

    // Calcular total final
    const total = cart.reduce((acc, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="delivery-container">
            <div className="form-section">
                <h2>Datos de entrega</h2>
                <form>
                    <input type="text" placeholder="Nombre" required />
                    <input type="text" placeholder="Número de documento" required />
                    <input type="text" placeholder="Teléfono" required />
                    <input type="text" placeholder="Ciudad" required />
                    <input type="text" placeholder="Dirección" required />
                </form>
            </div>

            <div className="summary-section">
                <h2>Resumen</h2>
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            <span>{item.title}</span>
                            <span>${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <hr />
                <p className="total">Total: ${total.toFixed(2)}</p>
                <button className="pay-button">Realizar pago</button>
            </div>
        </div>
    );
};

export default DatosEntrega;

import React, { useState } from "react";
import { useCart } from "./Hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DatosEntrega.css";

const DatosEntrega = () => {
    const { cart } = useCart();
    const navigate = useNavigate();

    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        documento: "",
        telefono: "",
        ciudad: "",
        direccion: "",
    });

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Calcular total
    const total = cart.reduce((acc, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return acc + price * item.quantity;
    }, 0);

    const handlePago = () => {
        // Validamos que todos los campos estén llenos
        const camposVacios = Object.values(formData).some((campo) => campo.trim() === "");

        if (camposVacios) {
            toast.error("⚠️ Por favor completa todos los datos de entrega.");
            return;
        }

        // Si todo está bien, redirigir
        navigate("/pago");
    };

    return (
        <div className="delivery-container">
            <div className="form-section">
                <h2>Datos de entrega</h2>
                <form>
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                    <input type="text" name="documento" placeholder="Número de documento" value={formData.documento} onChange={handleChange} required />
                    <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
                    <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} required />
                    <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />
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

                {/* Botón con alerta incluida */}
                <button className="pay-button" onClick={handlePago}>
                    Realizar pago
                </button>
            </div>
        </div>
    );
};

export default DatosEntrega;

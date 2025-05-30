import React from "react";
import "./MetodoPago.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MetodoPago = () => {
    const navigate = useNavigate();

    const handlePago = () => {
        toast.success("¡Pago exitoso! 🎉 Gracias por tu compra.");

        // Esperar unos segundos antes de redirigir
        setTimeout(() => {
            navigate("/confirmacion"); // Asegúrate de tener esta ruta creada
        }, 2000);
    };

    return (
        <div className="metodo-pago-container">
            <h2>Método de Pago</h2>
            <p>Selecciona tu método de pago preferido:</p>
            <div className="opciones-pago">
                <button className="btn-pse" onClick={handlePago}>
                    Pagar con PSE
                </button>
                <button className="btn-tarjeta" onClick={handlePago}>
                    Pagar con Tarjeta
                </button>
            </div>
        </div>
    );
};

export default MetodoPago;

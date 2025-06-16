import React, { useState } from "react";
import { useCart } from "./Hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DatosEntrega.css";

const DatosEntrega = () => {
    const { cart } = useCart();
    const navigate = useNavigate();

    // 🟡 Incluimos el correo del usuario en el formulario
    const [formData, setFormData] = useState({
        nombre: "",
        documento: "",
        telefono: "",
        ciudad: "",
        direccion: "",
        correo: localStorage.getItem("userEmail") || "", // Se precarga si existe
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const total = cart.reduce((acc, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return acc + price * item.quantity;
    }, 0);

    const handlePago = async () => {
        const camposVacios = Object.values(formData).some(
            (campo) => campo.trim() === ""
        );

        if (camposVacios) {
            toast.error("⚠️ Por favor completa todos los datos de entrega.");
            return;
        }

        try {
            const pedido = {
                usuario: {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    telefono: formData.telefono,
                },
                cocteles: cart,
                total: total.toFixed(2),
            };

            const res = await fetch("http://localhost:5000/api/pedido", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("🎉 Pedido enviado correctamente. Revisa tu correo.");
                navigate("/pago");
            } else {
                toast.error(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            toast.error("❌ Error al procesar el pedido.");
        }
    };

    return (
        <div className="delivery-container">
            <div className="form-section">
                <h2>Datos de entrega</h2>
                <form>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="documento"
                        placeholder="Número de documento"
                        value={formData.documento}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="ciudad"
                        placeholder="Ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </form>
            </div>

            <div className="summary-section">
                <h2>Resumen</h2>
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            <span>{item.title}</span>
                            <span>
                                $
                                {(
                                    parseFloat(item.price.replace("$", "")) * item.quantity
                                ).toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
                <hr />
                <p className="total">Total: ${total.toFixed(2)}</p>

                <button className="pay-button" onClick={handlePago}>
                    Realizar pago
                </button>
            </div>
        </div>
    );
};

export default DatosEntrega;

const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/", async (req, res) => {
    const { usuario, cocteles } = req.body;

    try {
        // 🔎 Calcular total real desde los cócteles
        let total = 0;
        cocteles.forEach((c) => {
            if (!c.price) return;

            const precioStr = typeof c.price === "string" ? c.price : c.price.toString();
            const precioLimpio = precioStr.replace(/[^\d,]/g, "").replace(",", ".");
            const precio = parseFloat(precioLimpio);

            if (!isNaN(precio)) {
                const cantidad = parseInt(c.quantity) || 1;
                total += precio * cantidad;
            } else {
                console.warn("⚠️ Precio inválido para cóctel:", c.title, c.price);
            }
        });

        // 💰 Formato final: redondeado a miles en pesos COP
        const totalRedondeado = Math.round(total / 1000) * 1000;
        const totalCOP = `$${totalRedondeado.toLocaleString("es-CO")} COP`;

        // Guardar en Supabase
        const { error: dbError } = await supabase
            .from("compras")
            .insert([
                {
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    direccion: usuario.direccion,
                    ciudad: usuario.ciudad,
                    telefono: usuario.telefono,
                    cocteles: JSON.stringify(cocteles),
                    total: totalRedondeado,
                },
            ]);

        if (dbError) {
            console.error("❌ Error al insertar en Supabase:", dbError);
            throw dbError;
        }

        // 🧾 Generar resumen visual
        const resumen = cocteles
            .map((c) => `• ${c.title} (x${c.quantity})`)
            .join("\n");

        const mensaje = `
¡Gracias por tu compra, ${usuario.nombre}! 🍹

Aquí está el resumen de tu pedido:
${resumen}

Total: ${totalCOP}

Dirección: ${usuario.direccion}, ${usuario.ciudad}
Teléfono: ${usuario.telefono}
`;

        // Enviar correo al usuario
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.correo,
            subject: "Confirmación de compra - Mystic Drinks",
            text: mensaje,
        });

        // Enviar copia a Mystic Drinks
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "mysticdrinksco@gmail.com",
            subject: "Nueva compra recibida - Mystic Drinks",
            text: `Nueva compra de ${usuario.nombre}:\n\n${mensaje}`,
        });

        res.status(200).json({
            success: true,
            message: "Pedido procesado exitosamente",
        });
    } catch (error) {
        console.error("❌ Error al procesar el pedido:", error);
        res.status(500).json({
            success: false,
            message: "Error al procesar el pedido",
        });
    }
});

module.exports = router;
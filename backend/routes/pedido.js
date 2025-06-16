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
    const { usuario, cocteles, total } = req.body;

    try {
        const { error: dbError } = await supabase
            .from("compras") // Asegúrate que este nombre coincida con Supabase
            .insert([
                {
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    direccion: usuario.direccion,
                    ciudad: usuario.ciudad,
                    telefono: usuario.telefono,
                    cocteles: JSON.stringify(cocteles),
                    total,
                },
            ]);

        if (dbError) {
            console.error("❌ Error al insertar en Supabase:", dbError);
            throw dbError;
        }

        const resumen = cocteles
            .map((c) => `• ${c.title} (x${c.quantity})`)
            .join("\n");

        const mensaje = `
¡Gracias por tu compra, ${usuario.nombre}! 🍹

Aquí está el resumen de tu pedido:
${resumen}

Total: $${total}
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

        // Copia para MysticDrinks
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "mysticdrinksco@gmail.com",
            subject: "Nueva compra recibida - Mystic Drinks",
            text: `Nueva compra de ${usuario.nombre}:\n\n${mensaje}`,
        });

        res.status(200).json({ success: true, message: "Pedido procesado exitosamente" });
    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        res.status(500).json({ success: false, message: "Error al procesar el pedido" });
    }
});

module.exports = router;

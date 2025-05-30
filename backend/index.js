require("dotenv").config(); // Carga variables del archivo .env

const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ====================== COCKTAILS ======================

// Obtener cocktails limitados
app.get("/api/cocktails", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching cocktails" });
    }

    const data = await response.json();
    const limitedDrinks = data.drinks.slice(0, limit);

    res.json(limitedDrinks);
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Obtener detalle de cocktail por ID
app.get("/api/cocktails/:idDrink", async (req, res) => {
  try {
    const { idDrink } = req.params;
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching cocktail details" });
    }

    const data = await response.json();

    if (!data.drinks || data.drinks.length === 0) {
      return res.status(404).json({ error: "Cocktail not found" });
    }

    res.json(data.drinks[0]);
  } catch (error) {
    console.error("Error fetching cocktail details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Proxy general
app.get("/api/:endpoint", async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const queryString = new URLSearchParams(req.query).toString();
    const url = `https://www.thecocktaildb.com/api/json/v1/1/${endpoint}?${queryString}`;
    console.log("Fetching external API:", url);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching external API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en proxy backend:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================== ENVÍO DE CORREO ======================

app.post("/api/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `📩 Nuevo mensaje de contacto de ${name}`,
    text: `
      Nombre: ${name}
      Correo: ${email}
      Teléfono: ${phone}
      Mensaje: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar correo" });
  }
});

// ====================== REGISTRO DE USUARIO CON CORREO ======================

app.post("/api/auth/register", async (req, res) => {
  const { name, email, edad, numero_de_identificacion, password } = req.body;

  if (!name || !email || !edad || !numero_de_identificacion || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Guardar el usuario en tu base de datos aquí si tienes una

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Registro exitoso - Bienvenido",
      html: `
        <h2>¡Hola, ${name}!</h2>
        <p>Gracias por registrarte en nuestra <strong>Barra Exclusiva</strong>. 🍸</p>
        <p>Esperamos que disfrutes de la mejor selección de cócteles y experiencias únicas.</p>
        <p><strong>¡Salud!</strong><br>El equipo de la barra.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Usuario registrado y correo enviado correctamente" });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: "Error en el registro o al enviar correo" });
  }
});

// ====================== REGISTRO CON GOOGLE ======================

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token de Google faltante" });
  }

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ message: "Token de Google inválido" });
    }

    const userData = await response.json();
    const { name, email, sub: googleId } = userData;

    // Guardar en base de datos si tienes una (opcional)
    // const user = await db.findOrCreateUser({ name, email, googleId });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Registro con Google exitoso - Bienvenido",
      html: `
        <h2>¡Hola, ${name}!</h2>
        <p>Gracias por registrarte con Google en nuestra <strong>Barra Exclusiva</strong>. 🍸</p>
        <p>Disfruta de nuestra selección de cócteles y experiencias únicas.</p>
        <p><strong>¡Salud!</strong><br>El equipo de la barra.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Usuario autenticado con Google y correo enviado",
      user: { name, email, googleId },
    });
  } catch (error) {
    console.error("❌ Error en autenticación con Google:", error);
    res.status(500).json({ message: "Error al autenticar con Google o enviar correo" });
  }
});

// ====================== INICIAR SERVIDOR ======================

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});

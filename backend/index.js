require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
const adminRoutes = require("./routes/users");
// Necesario para fetch en Node.js
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


// ====================== COCKTAILS ======================

app.get("/api/cocktails", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
    if (!response.ok) return res.status(response.status).json({ error: "Error fetching cocktails" });
    const data = await response.json();
    res.json(data.drinks.slice(0, limit));
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/cocktails/:idDrink", async (req, res) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${req.params.idDrink}`);
    if (!response.ok) return res.status(response.status).json({ error: "Error fetching cocktail details" });
    const data = await response.json();
    if (!data.drinks?.length) return res.status(404).json({ error: "Cocktail not found" });
    res.json(data.drinks[0]);
  } catch (error) {
    console.error("Error fetching cocktail details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/:endpoint", async (req, res) => {
  try {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/${req.params.endpoint}?${new URLSearchParams(req.query)}`;
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).json({ error: "Error fetching external API" });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
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
    text: `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone}\nMensaje: ${message}`,
  };

  try {
    // 1. Enviar correo
    await transporter.sendMail(mailOptions);

    // 2. Guardar mensaje en la tabla "mensajes"
    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, phone, message }]);

    if (error) {
      console.error("❌ Error al guardar el mensaje:", error);
      return res.status(500).json({ message: "Correo enviado pero no se pudo guardar el mensaje" });
    }

    res.status(200).json({ message: "Correo enviado y mensaje guardado correctamente" });
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar correo" });
  }
});


// ====================== REGISTRO MANUAL CORREGIDO ======================

app.post("/api/auth/register", async (req, res) => {
  const { name, email, edad, numero_de_identificacion, password } = req.body;

  if (!name || !email || !edad || !numero_de_identificacion || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Crear usuario en Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (authError || !authUser?.user?.id) {
      console.error("❌ Error en Auth:", authError);
      return res.status(500).json({ message: "Error en Auth: " + authError.message });
    }

    const userId = authUser.user.id;

    // Verificar si ya existe en tabla personalizada
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: "Este usuario ya fue registrado" });
    }

    // Insertar en tabla personalizada
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      name,
      email: cleanEmail,
      edad,
      numero_de_identificacion,
      rol: "user",
      created_at: new Date(),
    });

    if (insertError) {
      console.error("❌ Error al insertar en tabla users:", insertError);
      return res.status(500).json({ message: "Error al guardar datos del usuario" });
    }

    return res.status(201).json({ message: "Registro exitoso" });

  } catch (error) {
    console.error("❌ Error general en /register:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

// ====================== LOGIN MANUAL ======================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError || !authData?.user) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    // Buscar en tabla personalizada
    const { data: userProfile, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError) {
      console.error("⚠️ Error al obtener perfil:", userError);
      return res.status(500).json({ message: "Error al obtener perfil del usuario" });
    }

    return res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      user: userProfile,
      session: authData.session, // Puedes devolver token aquí si lo necesitas
    });

  } catch (error) {
    console.error("❌ Error general en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});


// ====================== AUTENTICACIÓN CON GOOGLE ======================

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token no proporcionado" });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ message: "Usuario no autenticado" });

    const email = user.email;

    // Intentamos obtener el usuario desde la tabla personalizada
    let { data: userData, error: userFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // Si no existe, lo creamos
    if (!userData) {
      console.warn("➡ Usuario no encontrado en tabla personalizada. Insertando...");

      const { data: insertedUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email,
          name: user.user_metadata.name || "",
          rol: "user",
          created_at: new Date(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error al insertar usuario:", insertError);
        return res.status(500).json({ message: "Error al registrar usuario" });
      }

      userData = insertedUser;
    }

    const isProfileComplete = !!userData?.edad && !!userData?.numero_de_identificacion;

    res.status(200).json({
      token,
      user: { ...userData, isProfileComplete },
    });

  } catch (err) {
    console.error("❌ Error en /api/auth/google:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// ====================== COMPLETAR PERFIL OAUTH ======================

app.post("/api/auth/oauth-register", async (req, res) => {
  const { token } = req.headers;
  const { edad, numero_de_identificacion } = req.body;

  if (!token || !edad || !numero_de_identificacion) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const parsedEdad = parseInt(edad);
  const cleanDni = numero_de_identificacion.trim();

  if (isNaN(parsedEdad) || parsedEdad < 18) {
    return res.status(400).json({ message: "Edad inválida o menor a 18." });
  }

  if (cleanDni.length < 6) {
    return res.status(400).json({ message: "El número de identificación debe tener al menos 6 caracteres." });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: "Token inválido o usuario no autenticado" });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ edad: parsedEdad, numero_de_identificacion: cleanDni })
      .eq("id", user.id)
      .select()
      .single(); // obtiene el usuario actualizado

    if (updateError) {
      console.error("Error al completar perfil:", updateError);
      return res.status(500).json({ message: "Error al actualizar perfil" });
    }

    res.status(200).json({ message: "Perfil completado con éxito", user });

  } catch (error) {
    console.error("❌ Error en /oauth-register:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// ====================== VERIFICAR SI ES USUARIO DE GOOGLE ======================

// Verifica si el usuario fue registrado con Google (google_id !== null)
app.get("/api/auth/provider", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email es requerido" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("google_id")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error buscando en tabla users:", error);
      return res.status(500).json({ message: "Error verificando proveedor de usuario" });
    }

    const isGoogleUser = !!data?.google_id;
    res.status(200).json({ isGoogleUser });
  } catch (err) {
    console.error("❌ Error en /api/auth/provider:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    // Obtener el usuario autenticado desde Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Buscar en tabla personalizada
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (dbError || !userData) {
      return res.status(404).json({ message: "Usuario no encontrado en la base de datos" });
    }

    res.json(userData);
  } catch (err) {
    console.error("❌ Error en /api/auth/me:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// ====================== INICIAR SERVIDOR ======================

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});

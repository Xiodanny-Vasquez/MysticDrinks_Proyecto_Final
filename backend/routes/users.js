const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("rol")
    .eq("id", data.user.id)
    .single();

  if (userError || userData?.rol !== "admin") {
    return res.status(403).json({ message: "Acceso restringido a administradores" });
  }

  req.user = data.user;
  next();
}

router.get("/", isAdmin, async (req, res) => {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ message: "Error al obtener usuarios" });
  res.json(data);
});

router.post("/", isAdmin, async (req, res) => {
  const { email, name, edad, numero_de_identificacion, rol } = req.body;

  if (!email || !name || !edad || !numero_de_identificacion) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password: crypto.randomUUID(), // generar contraseña dummy
      user_metadata: { name }
    });

    if (authError) {
      console.error("❌ Error en auth:", authError);
      return res.status(500).json({ message: "Error al crear usuario en Auth" });
    }

    const userId = authData.user?.id;

    const { data, error } = await supabase
      .from("users")
      .insert([{
        id: userId,
        email,
        name,
        edad,
        numero_de_identificacion,
        rol: rol || "user",
        google_id: null,
      }])
      .select()
      .single();

    if (error) {
      console.error("❌ Error al insertar en users:", error);
      return res.status(500).json({ message: "Error al crear usuario en tabla users" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Exception en POST /api/admin:", err);
    res.status(500).json({ message: "Error inesperado en servidor" });
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  const { data, error } = await supabase
    .from("users")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: "Error al actualizar usuario" });
  res.json(data);
});

router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return res.status(500).json({ message: "Error al eliminar usuario" });
  res.json({ message: "Usuario eliminado correctamente" });
});

module.exports = router;
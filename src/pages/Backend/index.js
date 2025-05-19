require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Conexión MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mystic_drinks',
});

// Ruta registro tradicional
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Faltan campos obligatorios' });

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Correo ya registrado' });

    await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta login con Google
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Insertar usuario nuevo si no existe
      await db.execute(
        'INSERT INTO users (name, email, picture) VALUES (?, ?, ?)',
        [name, email, picture]
      );
    }

    res.json({ message: 'Autenticado correctamente', user: { name, email, picture } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token inválido' });
  }
});

// Ruta para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

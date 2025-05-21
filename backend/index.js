const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint para obtener cocktails limitados (filtro categoría "Cocktail")
app.get("/api/cocktails", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Llamamos a filter.php para categoría "Cocktail" (puedes cambiar categoría si quieres)
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching cocktails" });
    }

    const data = await response.json();
    // Limitamos los resultados a `limit`
    const limitedDrinks = data.drinks.slice(0, limit);

    res.json(limitedDrinks);
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint para obtener detalles de cocktail por idDrink
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

// Proxy general para otros endpoints
app.get("/api/:endpoint", async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const query = req.query;
    const queryString = new URLSearchParams(query).toString();

    const url = `https://www.thecocktaildb.com/api/json/v1/1/${endpoint}?${queryString}`;
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

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});

const pool = require("./mysqlConnection");

// Crear un nuevo cóctel personalizado
async function createCocktail({ name, ingredients, instructions }) {
  try {
    const sql = "INSERT INTO cocktails (name, ingredients, instructions) VALUES (?, ?, ?)";
    const [result] = await pool.execute(sql, [name, ingredients, instructions]);
    return { id: result.insertId, name, ingredients, instructions };
  } catch (error) {
    console.error("Error al crear cóctel:", error);
    throw error;
  }
}

// Obtener todos los cócteles personalizados
async function getAllCocktails() {
  try {
    const [rows] = await pool.query("SELECT * FROM cocktails ORDER BY id DESC");
    return rows;
  } catch (error) {
    console.error("Error al obtener cócteles:", error);
    throw error;
  }
}

// Obtener cóctel por ID
async function getCocktailById(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM cocktails WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error al obtener cóctel por ID:", error);
    throw error;
  }
}

// Actualizar cóctel personalizado
async function updateCocktail(id, { name, ingredients, instructions }) {
  try {
    const sql = "UPDATE cocktails SET name = ?, ingredients = ?, instructions = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [name, ingredients, instructions, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al actualizar cóctel:", error);
    throw error;
  }
}

// Eliminar cóctel personalizado
async function deleteCocktail(id) {
  try {
    const [result] = await pool.execute("DELETE FROM cocktails WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al eliminar cóctel:", error);
    throw error;
  }
}

module.exports = {
  createCocktail,
  getAllCocktails,
  getCocktailById,
  updateCocktail,
  deleteCocktail,
};

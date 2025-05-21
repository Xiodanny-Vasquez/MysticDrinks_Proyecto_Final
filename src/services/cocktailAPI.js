const API_BASE_URL = "/api";

// Función para mezclar aleatoriamente un array (algoritmo de Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function fetchLimitedCocktails(limit = 5) {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=Cocktail`);
    if (!response.ok) throw new Error("Error fetching cocktails");
    const data = await response.json();
    if (!data.drinks) return [];

    const shuffled = shuffleArray(data.drinks);
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error("fetchLimitedCocktails error:", error);
    throw error;
  }
}

export async function fetchAllCocktails(minLimit = 50) {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=Cocktail`);
    if (!response.ok) throw new Error("Error fetching cocktails");
    const data = await response.json();
    if (!data.drinks) return [];

    const shuffled = shuffleArray(data.drinks);
    return shuffled.slice(0, minLimit);
  } catch (error) {
    console.error("fetchAllCocktails error:", error);
    throw error;
  }
}

export const fetchCocktailById = async (id) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.drinks ? data.drinks[0] : null;
  } catch (error) {
    console.error("Error al obtener cóctel por ID:", error);
    throw error;
  }
};

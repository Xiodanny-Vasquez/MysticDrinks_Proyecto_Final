const API_URL = "http://localhost:5000/api/custom-cocktails";

export async function getCustomCocktails() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getCustomCocktailById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function createCustomCocktail(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateCustomCocktail(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteCustomCocktail(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return await res.json();
}

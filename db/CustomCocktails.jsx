import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener esto
import {
  getCustomCocktails,
  createCustomCocktail,
  updateCustomCocktail,
  deleteCustomCocktail,
} from "../services/customCocktailService";
import { isAdminUser } from "../utils/auth";

const CustomCocktails = () => {
  const navigate = useNavigate();
  const [cocktails, setCocktails] = useState([]);
  const [form, setForm] = useState({ name: "", ingredients: "", instructions: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!isAdminUser()) {
      navigate("/"); // Redirige al inicio si no es admin
    } else {
      fetchCocktails(); // Solo carga los datos si es admin
    }
  }, []);

  const fetchCocktails = async () => {
    const data = await getCustomCocktails();
    setCocktails(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCustomCocktail(editingId, form);
    } else {
      await createCustomCocktail(form);
    }
    setForm({ name: "", ingredients: "", instructions: "" });
    setEditingId(null);
    fetchCocktails();
  };

  const handleEdit = (cocktail) => {
    setForm(cocktail);
    setEditingId(cocktail.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este cóctel?")) {
      await deleteCustomCocktail(id);
      fetchCocktails();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">CRUD de Cócteles Personalizados</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredientes"
          value={form.ingredients}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="instructions"
          placeholder="Instrucciones"
          value={form.instructions}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <ul className="space-y-2">
        {cocktails.map((cocktail) => (
          <li key={cocktail.id} className="border p-3 rounded">
            <h3 className="font-bold">{cocktail.name}</h3>
            <p><strong>Ingredientes:</strong> {cocktail.ingredients}</p>
            <p><strong>Instrucciones:</strong> {cocktail.instructions}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(cocktail)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cocktail.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomCocktails;
import React, { useEffect, useState } from "react";
import axios from "axios";
import CocktailForm from "./CocktailForm";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [cocktails, setCocktails] = useState([]);
  const [editingCocktail, setEditingCocktail] = useState(null);

  const fetchCocktails = async () => {
    const res = await axios.get("/api/cocktails");
    setCocktails(res.data);
  };

  const handleEdit = (cocktail) => {
    setEditingCocktail(cocktail);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/cocktails/${id}`);
    fetchCocktails();
  };

  const handleFormSuccess = () => {
    setEditingCocktail(null);
    fetchCocktails();
  };

  useEffect(() => {
    fetchCocktails();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Panel de Administración de Cócteles</h2>

      <CocktailForm onSuccess={handleFormSuccess} cocktailToEdit={editingCocktail} />

      <h3>Lista de Cócteles</h3>
      <ul>
        {cocktails.map((cocktail) => (
          <li key={cocktail.id}>
            <strong>{cocktail.name}</strong> - {cocktail.category}
            <button onClick={() => handleEdit(cocktail)}>Editar</button>
            <button onClick={() => handleDelete(cocktail.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;

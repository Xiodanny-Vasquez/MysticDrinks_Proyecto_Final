import React, { useEffect, useState } from "react";
import axios from "axios";

const initialState = {
  name: "",
  category: "",
  instructions: "",
  image: "",
};

const CocktailForm = ({ onSuccess, cocktailToEdit }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (cocktailToEdit) {
      setFormData(cocktailToEdit);
    } else {
      setFormData(initialState);
    }
  }, [cocktailToEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id) {
      // Editar
      await axios.put(`/api/cocktails/${formData.id}`, formData);
    } else {
      // Crear
      await axios.post("/api/cocktails", formData);
    }
    onSuccess();
    setFormData(initialState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{formData.id ? "Editar Cóctel" : "Nuevo Cóctel"}</h3>
      <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
      <input name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} required />
      <input name="image" placeholder="URL Imagen" value={formData.image} onChange={handleChange} />
      <textarea name="instructions" placeholder="Instrucciones" value={formData.instructions} onChange={handleChange} />
      <button type="submit">{formData.id ? "Guardar Cambios" : "Crear"}</button>
    </form>
  );
};

export default CocktailForm;

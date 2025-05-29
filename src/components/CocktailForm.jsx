import { useState } from 'react';
import axios from 'axios';

export default function CocktailForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', category: '', instructions: '', image: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/cocktails', form);
    onCreated();
    setForm({ name: '', category: '', instructions: '', image: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Categoría" />
      <textarea name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instrucciones" />
      <input name="image" value={form.image} onChange={handleChange} placeholder="URL de imagen" />
      <button type="submit">Guardar</button>
    </form>
  );
}

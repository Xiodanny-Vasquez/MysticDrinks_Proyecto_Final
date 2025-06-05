import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";
import "./AdminPage.css";

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [identification, setIdentification] = useState("");
  const [rol, setRol] = useState("user");
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.message || "Error cargando usuarios";
        toast.error(msg);
        setUsers([]);
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      toast.error("Error cargando usuarios");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setEmail("");
    setName("");
    setAge("");
    setIdentification("");
    setRol("user");
    setEditingUserId(null);
  };

  const handleCreate = async () => {
    const edadParsed = parseInt(age, 10);

    if (!email.trim() || !name.trim() || isNaN(edadParsed) || edadParsed <= 0 || !identification.trim()) {
      return toast.warn("Todos los campos son obligatorios y la edad debe ser válida");
    }

    const payload = {
      email: email.trim(),
      name: name.trim(),
      edad: edadParsed,
      numero_de_identificacion: identification.trim(),
      rol,
    };

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {}

      if (!res.ok) {
        const errorMessage = data?.message || `Error inesperado (${res.status})`;
        return toast.error(`Error al crear usuario: ${errorMessage}`);
      }

      toast.success("Usuario creado exitosamente");
      await fetchUsers();
      resetForm();
    } catch (error) {
      toast.error(`Error al crear usuario: ${error.message}`);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEmail(user.email);
    setName(user.name || "");
    setAge(user.edad?.toString() || "");
    setIdentification(user.numero_de_identificacion || "");
    setRol(user.rol);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    const edadParsed = parseInt(age, 10);
    if (!email.trim() || !name.trim() || isNaN(edadParsed) || edadParsed <= 0 || !identification.trim()) {
      return toast.warn("Todos los campos son obligatorios y la edad debe ser válida");
    }

    try {
      const res = await fetch(`/api/admin/${editingUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          edad: edadParsed,
          numero_de_identificacion: identification.trim(),
          rol,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.message || "Error al actualizar usuario";
        return toast.error(msg);
      }

      toast.success("Usuario actualizado exitosamente");
      await fetchUsers();
      resetForm();
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.message || "Error al eliminar usuario";
        return toast.error(msg);
      }

      toast.success("Usuario eliminado");
      if (editingUserId === id) resetForm();
      await fetchUsers();
    } catch (error) {
      toast.error("Error al eliminar usuario");
    }
  };

  const handleRoleChange = async (id, newRol) => {
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rol: newRol }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.message || "Error al actualizar rol";
        return toast.error(msg);
      }

      toast.success("Rol actualizado");
      await fetchUsers();
    } catch (error) {
      toast.error("Error al actualizar rol");
    }
  };

  return (
    <div className="admin-panel">
      <h2>👑 Panel de Administración</h2>
      <p>Bienvenido, administrador.</p>
      <div className="form-section">
        <h3>{editingUserId ? "Editar usuario" : "Crear nuevo usuario"}</h3>
        <div className="form-grid">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" placeholder="Edad" value={age} onChange={(e) => setAge(e.target.value)} />
          <input type="text" placeholder="Identificación" value={identification} onChange={(e) => setIdentification(e.target.value)} />
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          {editingUserId ? (
            <button onClick={handleUpdate}>Guardar cambios</button>
          ) : (
            <button onClick={handleCreate}>Crear</button>
          )}
          {editingUserId && (
            <button className="cancel-btn" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </div>
      <h3>Usuarios registrados</h3>
      {loadingUsers ? (
        <p>Cargando...</p>
      ) : users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Identificación</th>
                <th>Proveedor</th>
                <th>Rol</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name || "-"}</td>
                  <td>{u.edad ?? "-"}</td>
                  <td>{u.numero_de_identificacion || "-"}</td>
                  <td>{u.provider || "-"}</td>
                  <td>
                    <select value={u.rol} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEditClick(u)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDelete(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

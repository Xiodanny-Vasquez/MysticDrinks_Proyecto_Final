import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../context/supabaseClient";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await supabase.auth.setSessionFromUrl();
      } catch (err) {
        console.error("Error restaurando sesión:", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("Error al actualizar contraseña: " + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/account"), 3000);
    }
  };

  if (loading) return <p>Validando token...</p>;

  return (
    <div>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar contraseña</button>
      </form>
      {success && <p>✅ Contraseña actualizada. Redirigiendo al login...</p>}
    </div>
  );
}

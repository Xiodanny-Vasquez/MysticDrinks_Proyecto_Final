import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../context/supabaseClient";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        // 1. Espera 500ms para asegurar que Supabase tenga tiempo de procesar el login
        await new Promise((res) => setTimeout(res, 500));

        // 2. Obtiene la sesión
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("No hay sesión activa con Supabase:", error);
          return navigate("/Register"); // 👈 Esto antes iba a /account, pero si falla es mejor a /login
        }

        const token = session.access_token;

        // 3. Envía el token a tu backend
        const res = await axios.post("/api/auth/google", { token });
        const { user, token: backendToken } = res.data;

        // 4. Guarda en localStorage y contexto global
        localStorage.setItem("token", backendToken);
        localStorage.setItem("user", JSON.stringify(user));
        login(user, backendToken);

        // 5. Redirige según si el perfil está completo
        if (!user.isProfileComplete) {
        navigate("/complete-profile");
        } else {
          
          navigate(user.role === "admin" ? "/admin" : "/");
}

      } catch (err) {
        console.error("Error en el callback de Google OAuth:", err);
        navigate("/account"); // redirección segura
      }
    };

    handleOAuthRedirect();
  }, [navigate, login]);

  return <p>Autenticando con Google...</p>;
}

export default OAuthCallback;

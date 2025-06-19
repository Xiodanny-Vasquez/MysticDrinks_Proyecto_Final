import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import { User } from "lucide-react";
import "./UserMenu.css";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/account");
  };

  if (!user) {
    return (
      <Nav.Link onClick={() => navigate("/account")} className="icon-link">
        <User size={25} color="white" />
      </Nav.Link>
    );
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <Nav.Link onClick={() => setOpen(!open)} className="icon-link">
        <User size={25} color="orange" />
      </Nav.Link>
      
      {open && (
        <ul className="dropdown">
          <li onClick={() => navigate("/accountPage")}>Perfil</li>
          <li onClick={handleLogout}>Cerrar sesión</li>
          
        </ul>
      )}
    </div>
  );
};

export default UserMenu;

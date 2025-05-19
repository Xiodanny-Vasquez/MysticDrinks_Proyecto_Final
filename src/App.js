import React from "react";
import { Routes, Route } from "react-router-dom"; // ⬅️ sólo esto, sin BrowserRouter
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Products from "./pages/Productos/Productos";
import SectionShop from "./pages/Shopping-cart/Section-Shop";
import { CartProvider } from "./pages/Shopping-cart/Context/cardContext";
import CoctelesDetalles from "./pages/CoctelesDetalles/CoctelesDetalles";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NavBar from "./pages/Home/Navbar/NavBar";
import FooterSection from "./pages/Home/Footer/FooterSection";
import CocktailQuestionnaire from "./pages/Home/QuizRecomendacion/CocktailRecommender";
import "./customTheme.css";
import UsersList from './pages/Backend/UserList';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/cart" element={<SectionShop />} />
            <Route path="/account" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz" element={<CocktailQuestionnaire />} />
            <Route path="/cocktail/:idDrink" element={<CoctelesDetalles />} />
            <Route path="/usuarios" element={<UsersList />} />
            <Route
              path="*"
              element={
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "80vh" }}
                >
                  <h2>404 - Página no encontrada</h2>
                </div>
              }
            />
          </Routes>
        </div>
        <FooterSection />
      </div>
    </CartProvider>
  );
}

export default App;

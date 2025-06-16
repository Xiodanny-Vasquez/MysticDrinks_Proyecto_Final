/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { fetchLimitedCocktails } from "../../services/cocktailAPI";
import CoctelCard from "../../components/CoctelCard";
import "./CocktailList.css";
import CoctelSpinner from "../../components/CoctelSpinner";
import { Search } from "lucide-react";

function CocktailList() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientFilter, setIngredientFilter] = useState("");
  const [alcoholicFilter, setAlcoholicFilter] = useState("");

  useEffect(() => {
    const getCocktails = async () => {
      try {
        setError(null);
        const cocktailsData = await fetchLimitedCocktails(50);
        validateCocktails(cocktailsData);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    getCocktails();
  }, []);

  const validateCocktails = (cocktailsData) => {
    if (!Array.isArray(cocktailsData)) {
      throw new Error("Received invalid data format from API");
    }

    // ✅ Asignar precio aleatorio entre $35.000 y $45.000 COP
    const cocktailsWithPrice = cocktailsData.map((drink) => {
      const precioAleatorio = Math.floor(Math.random() * 10000) + 35000;
      return {
        ...drink,
        price: `$${precioAleatorio.toLocaleString("es-CO")} COP`,
      };
    });

    setCocktails(cocktailsWithPrice);
  };

  const handleError = (error) => {
    console.error(error);
    setError("Ocurrió un error al cargar los cócteles.");
  };

  // 🔎 Filtros de búsqueda
  const filteredCocktails = cocktails.filter((cocktail) => {
    const matchesSearch = cocktail.strDrink
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesIngredient = ingredientFilter
      ? [cocktail.strIngredient1, cocktail.strIngredient2, cocktail.strIngredient3]
        .some((ing) => ing?.toLowerCase() === ingredientFilter.toLowerCase())
      : true;
    const matchesAlcoholic = alcoholicFilter
      ? cocktail.strAlcoholic?.toLowerCase() === alcoholicFilter.toLowerCase()
      : true;

    return matchesSearch && matchesIngredient && matchesAlcoholic;
  });

  return (
    <div className="container-fluid p-0">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onIngredientChange={setIngredientFilter}
        onAlcoholicChange={setAlcoholicFilter}
      />
      <CocktailContent loading={loading} error={error} cocktails={filteredCocktails} />
    </div>
  );
}

const SearchHeader = ({ searchQuery, onSearchChange, onIngredientChange, onAlcoholicChange }) => (
  <div className="search-header text-center py-5">
    <div className="container">
      <h1 className="mb-2 cursive-font">¿Tienes un Cóctel favorito?</h1>
      <p className="text-white mb-4 fs-5">Descúbrelo en nuestra selección exclusiva.</p>
      <SearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />
    </div>
  </div>
);

const SearchInput = ({ searchQuery, onSearchChange }) => (
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="Ej: Mojito"
          value={searchQuery}
          onChange={onSearchChange}
          aria-label="Búsqueda de cocteles"
        />
        <button className="btn btn-outline-none" type="button">
          <Search color="white" />
        </button>
      </div>
    </div>
  </div>
);

const CocktailContent = ({ loading, error, cocktails }) => (
  <div className="cocteles-card">
    <div className="container py-3">
      {loading ? (
        <CoctelSpinner />
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : !cocktails.length ? (
        <div className="text-center text-white container">
          No se encontraron cócteles disponibles.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {cocktails.map((cocktail) => (
            <div className="col" key={cocktail.idDrink}>
              <CoctelCard cocktail={cocktail} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default CocktailList;

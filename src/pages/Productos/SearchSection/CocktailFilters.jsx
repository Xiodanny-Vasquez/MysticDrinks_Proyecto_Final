import React from "react";
import { Search } from "lucide-react";
import Dropdown from "../../../components/Dropdown";

const CocktailFilters = ({
  searchQuery,
  onSearchChange,
  onIngredientChange,
  onAlcoholicChange,
}) => (
  <div className="text-center py-4">
    <div className="container">
      <h1 className="mb-2 cursive-font">¿Tienes un coctel favorito?</h1>
      <p className="text-white mb-4 fs-5">
        Estamos seguros de que aquí lo encontrarás
      </p>

      {/* Search Input */}
      <div className="row justify-content-center mb-3">
        <div className="col-md-6">
          <div className="input-group">
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

      {/* Ingredient Dropdown */}
      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          <Dropdown
            title="Ingrediente"
            options={["Vodka", "Gin", "Rum", "Tequila"]}
            onSelect={onIngredientChange}
          />
        </div>
        <div className="col-auto">
          <Dropdown
            title="Tipo"
            options={["Alcoholic", "Non-Alcoholic"]}
            onSelect={onAlcoholicChange}
          />
        </div>
      </div>
    </div>
  </div>
);

export default CocktailFilters;

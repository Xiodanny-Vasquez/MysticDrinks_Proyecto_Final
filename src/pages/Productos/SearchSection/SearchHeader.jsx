import React from "react";
import CocktailFilters from "./CocktailFilters";

const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onIngredientChange, 
  onAlcoholicChange 
}) => (
  <div className="search-header">
    <CocktailFilters
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onIngredientChange={onIngredientChange}
      onAlcoholicChange={onAlcoholicChange}
    />
  </div>
);

export default SearchHeader;

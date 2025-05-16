import React from "react";
import CocktailList from "./CocktailList";
import BannerProducts from "./BannerProducts";

function Home() {
  return (
    <div style={{ backgroundColor: "var(--primarycolor)" }}>
      {<BannerProducts/>}
      <CocktailList />
    </div>
  );
}

export default Home;

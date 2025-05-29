import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CocktailList() {
  const [publicDrinks, setPublicDrinks] = useState([]);
  const [customDrinks, setCustomDrinks] = useState([]);

  useEffect(() => {
    axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
      .then(res => setPublicDrinks(res.data.drinks || []));

    axios.get('http://localhost:3001/api/cocktails')
      .then(res => setCustomDrinks(res.data));
  }, []);

  return (
    <>
      <h2>Cócteles Públicos</h2>
      <ul>
        {publicDrinks.map(d => (
          <li key={d.idDrink}>{d.strDrink}</li>
        ))}
      </ul>

      <h2>Mis Cócteles</h2>
      <ul>
        {customDrinks.map(d => (
          <li key={d.id}>{d.name}</li>
        ))}
      </ul>
    </>
  );
}

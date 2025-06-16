/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./CocktailQuestionnaire.css";
import CoctelCard from "../../../components/CoctelCard";

const questions = [
  {
    id: 1,
    question: "¿Cuál es tu licor preferido?",
    options: ["Vodka", "Ginebra", "Ron", "Tequila", "Whisky"],
  },
  {
    id: 2,
    question: "¿Qué tipo de bebida prefieres?",
    options: [
      "Bebida común",
      "Cóctel",
      "Trago",
      "Bebida de fiesta / Punch",
      "Café / Té",
    ],
  },
  {
    id: 3,
    question: "¿Cuál es tu estilo de servicio preferido?",
    options: [
      "Copa de cóctel",
      "Copa alta",
      "Copa old-fashioned",
      "Vaso de trago",
      "Cualquier vaso",
    ],
  },
  {
    id: 4,
    question: "¿Tienes alguna preferencia de sabor?",
    options: ["Cítrico", "Dulce", "Fuerte", "Cremoso", "Refrescante"],
  },
];

const getIngredientsList = (cocktail) => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }
  return ingredients;
};

const CocktailQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCocktailsBySpirit = async (spirit) => {
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`
      );
      const data = await response.json();
      return data.drinks || [];
    } catch (error) {
      console.error("Error fetching cocktails:", error);
      return [];
    }
  };

  const fetchCocktailDetails = async (id) => {
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      return data.drinks[0];
    } catch (error) {
      console.error("Error fetching cocktail details:", error);
      return null;
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    const spirit = answers[1].toLowerCase();
    const preferredType = answers[2].toLowerCase();
    const preferredGlass = answers[3].toLowerCase();
    const flavorPreference = answers[4].toLowerCase();

    try {
      let cocktails = await fetchCocktailsBySpirit(spirit);

      const selectedCocktails = cocktails
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);

      const detailedCocktails = await Promise.all(
        selectedCocktails.map((cocktail) =>
          fetchCocktailDetails(cocktail.idDrink)
        )
      );

      const scoredCocktails = detailedCocktails
        .filter(Boolean)
        .map((cocktail) => {
          let score = 0;
          const ingredients = getIngredientsList(cocktail);

          if (
            cocktail.strCategory
              .toLowerCase()
              .includes(preferredType.toLowerCase())
          ) {
            score += 3;
          }

          if (
            preferredGlass === "any glass" ||
            cocktail.strGlass
              .toLowerCase()
              .includes(preferredGlass.toLowerCase())
          ) {
            score += 2;
          }

          const instructions = cocktail.strInstructions.toLowerCase();
          const allIngredients = ingredients
            .map((i) => i.ingredient.toLowerCase())
            .join(" ");

          if (
            flavorPreference === "citrusy" &&
            (allIngredients.includes("lime") ||
              allIngredients.includes("lemon") ||
              allIngredients.includes("orange"))
          ) {
            score += 2;
          }

          if (
            flavorPreference === "sweet" &&
            (allIngredients.includes("sugar") ||
              allIngredients.includes("syrup") ||
              allIngredients.includes("liqueur"))
          ) {
            score += 2;
          }

          if (
            flavorPreference === "strong" &&
            ingredients.length <= 4 &&
            cocktail.strAlcoholic === "Alcoholic"
          ) {
            score += 2;
          }

          if (
            flavorPreference === "creamy" &&
            (allIngredients.includes("cream") ||
              allIngredients.includes("milk") ||
              allIngredients.includes("baileys"))
          ) {
            score += 2;
          }

          if (
            flavorPreference === "refreshing" &&
            (instructions.includes("ice") ||
              allIngredients.includes("soda") ||
              allIngredients.includes("tonic"))
          ) {
            score += 2;
          }

          return {
            ...cocktail,
            score,
            ingredients,
            price: `$${(Math.random() * 10 + 10).toFixed(2)}`, // 👈 Añadir precio
          };

        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setRecommendations(scoredCocktails);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: answer,
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  useEffect(() => {
    if (isComplete) {
      getRecommendations();
    }
  }, [isComplete]);

  const resetQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setRecommendations([]);
  };

  if (isComplete) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center vh-100"
        style={{ fontFamily: "Poppins" }}
      >
        <div className="bg-color shadow-lg p-4 rounded">
          <div className="">
            <div className="text-center mb-3">
              <h2 className="text-center card-title h4 mb-4 text-white">
                Nuestra recomendación
              </h2>
              <div className="small">
                {Object.entries(answers).map(([questionId, answer]) => (
                  <p key={questionId} className="mb-1">
                    <strong>{questions[questionId - 1].question}</strong>:{" "}
                    <span className="fw-semibold text-info">{answer}</span>
                  </p>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-light">
                  Buscando los cócteles perfectos para ti...
                </p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-light">No se encontraron cócteles, intenta de nuevo.</p>
              </div>
            ) : (
              <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {recommendations.map((cocktail) => (
                  <div className="col" key={cocktail.idDrink}>
                    <CoctelCard cocktail={cocktail} />
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-4">
              <button
                onClick={resetQuestionnaire}
                className="btn btn-primary d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Volver a empezar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 text-white">
      <div
        className="bg-color shadow-lg p-4 rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body " style={{ fontFamily: "Poppins" }}>
          <div className="mb-4">
            <div className="d-flex justify-content-between small mb-2">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div
              className="progress"
              style={{ height: "10px", borderRadius: "5px" }}
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                role="progressbar"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h5 className="fw-bold mb-4 text-center">
            {questions[currentQuestion].question}
          </h5>

          <div className="d-grid gap-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="btn btn-outline-light text-start py-3 px-4"
                style={{ borderRadius: "10px" }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocktailQuestionnaire;

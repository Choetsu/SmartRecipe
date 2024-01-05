import React, { useState, useEffect } from "react";
import "../style/Recette.css";

function Recette() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const savedRecipes = [
      { id: 1, title: "Recette 1", description: "Description de la recette 1" },
      { id: 2, title: "Recette 2", description: "Description de la recette 2" },
      { id: 3, title: "Recette 3", description: "Description de la recette 3" },
      { id: 4, title: "Recette 4", description: "Description de la recette 4" },
      { id: 5, title: "Recette 5", description: "Description de la recette 5" },
    ];

    setRecipes(savedRecipes);
  }, []);

  return (
    <div className="Recette">
      <h1>Recettes Enregistrées</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>

            <button href="#">Favoris</button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recette;

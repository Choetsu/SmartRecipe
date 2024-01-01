import React, { useState, useEffect } from "react";

function Recette() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const savedRecipes = [
      { id: 1, title: "Recette 1", description: "Description de la recette 1" },
      { id: 2, title: "Recette 2", description: "Description de la recette 2" },
    ];

    setRecipes(savedRecipes);
  }, []);

  return (
    <div>
      <h1>Recettes Enregistrées</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recette;

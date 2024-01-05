import React, { useState, useEffect } from "react";
import "../style/Recherche.css";
import axios from "axios";

function Recherche() {
    const [destinationInput, setDestinationInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState([]);

    const [recipeData, setRecipeData] = useState({
        name: "",
        description: "",
        ingredient: "",
        instruction: "",
        preparation_time: "",
        cooking_time: "",
        categorie: "",
    });

    useEffect(() => {
        console.log("Recipe Data Updated", recipeData);
    }, [recipeData]); // L'effet s'exécutera chaque fois que recipeData change

    const handleSearch = async () => {
        setLoading(true);
        try {
            const searchResponse = await axios.post(
                "http://localhost:3000/recipe-search",
                { recipeInput: destinationInput }
            );

            const responseList = searchResponse.data.split("\n");

            let recipeName = "";
            let recipeDescription = "";
            let ingredients = "";
            let recipeSteps = "";
            let prepTime = "";
            let cookTime = "";
            let category = "";

            let currentSegment = "";

            responseList.forEach((element) => {
                if (element.startsWith("Nom de la recette")) {
                    recipeName = element
                        .substring("Nom de la recette".length)
                        .trim();
                    currentSegment = "";
                } else if (element.startsWith("Description de la recette")) {
                    recipeDescription = element
                        .substring("Description de la recette :".length)
                        .trim();
                    currentSegment = "";
                } else if (element.startsWith("Ingrédients")) {
                    ingredients = element
                        .substring("Ingrédients".length)
                        .trim();
                    currentSegment = "ingredients";
                } else if (element.startsWith("Étapes de la recette")) {
                    recipeSteps = element
                        .substring("Étapes de la recette".length)
                        .trim();
                    currentSegment = "steps";
                } else if (element.startsWith("Temps de préparation")) {
                    prepTime = element
                        .substring("Temps de préparation".length)
                        .trim();
                    currentSegment = "";
                } else if (element.startsWith("Temps de cuisson")) {
                    cookTime = element
                        .substring("Temps de cuisson".length)
                        .trim();
                    currentSegment = "";
                } else if (element.startsWith("Catégorie")) {
                    category = element.substring("Catégorie".length).trim();
                    currentSegment = "";
                } else {
                    if (
                        currentSegment === "ingredients" &&
                        element.trim() !== ""
                    ) {
                        ingredients += "\n" + element.trim();
                    } else if (
                        currentSegment === "steps" &&
                        element.trim() !== ""
                    ) {
                        recipeSteps += "\n" + element.trim();
                    }
                }
            });

            setRecipeData({
                name: recipeName,
                description: recipeDescription,
                ingredient: ingredients,
                instruction: recipeSteps,
                preparation_time: prepTime,
                cooking_time: cookTime,
                categorie: category,
            });

            console.log("recipeName", recipeName);
            console.log("recipeDescription", recipeDescription);
            console.log("ingredients", ingredients);
            console.log("recipeSteps", recipeSteps);
            console.log("prepTime", prepTime);
            console.log("cookTime", cookTime);
            console.log("category", category);

            let displayResponse = responseList.filter((item) => item !== "");

            setResponse(displayResponse);
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            setResponse([]);
        }
        setLoading(false);
    };

    const Save = async () => {
        try {
            const saveResponse = await axios.post(
                "http://localhost:3000/recipes/add-recipe",
                recipeData
            );
            console.log("saveResponse", saveResponse);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
        }
    };

    return (
        <div className="recherche">
            <h1>Moteur de Recherche de Recette</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher de recette"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                />
                <button onClick={handleSearch}>Rechercher</button>
            </div>
            {loading && <div>Chargement en cours...</div>}
            <ul>
                {response.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <div className="search-container">
                <button onClick={Save}>Ajouter</button>
            </div>
        </div>
    );
}

export default Recherche;

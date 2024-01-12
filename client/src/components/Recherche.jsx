import { useState } from "react";
import axios from "axios";
import Chatbot from "./Chatbot";
import { useNavigate } from "react-router-dom";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

function Recherche() {
    const [destinationInput, setDestinationInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [recipeData, setRecipeData] = useState({
        name: "",
        description: "",
        ingredient: "",
        instruction: "",
        preparation_time: "",
        cooking_time: "",
        categorie: "",
    });

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${apiUrl}/recipes/all`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const recipe = fetchRecipes().then((data) => {
        let recipes = "";
        data.forEach((element) => {
            recipes += "\n" + element.name + " : " + element.description;
        });
        return recipes;
    });

    const handleSearch = async () => {
        setResponse([]);
        setRecipeData({
            name: "",
            description: "",
            ingredient: "",
            instruction: "",
            preparation_time: "",
            cooking_time: "",
            categorie: "",
        });

        setLoading(true);
        try {
            const searchResponse = await axios.post(`${apiUrl}/recipe-search`, {
                recipeInput:
                    "Voici les recettes stockées que je possède en base de données : " +
                    recipe +
                    "\n" +
                    "Voici la demande de l'utilisateur : " +
                    destinationInput,
            });

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
                        .substring("Etapes de la recette".length)
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

            let displayResponse = responseList.filter((item) => item !== "");

            setResponse(displayResponse);
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            setResponse([]);
        }
        setLoading(false);
    };
    const navigate = useNavigate();

    const Save = async () => {
        try {
            await axios.post(`${apiUrl}/recipes/add-recipe`, recipeData);

            navigate("/recettes");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
        }
    };

    const startListening = () => {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = "fr-FR";
            recognition.start();

            recognition.onresult = (event) => {
                const voiceInput = event.results[0][0].transcript;
                setDestinationInput(voiceInput);
                handleSearch();
            };
        } else {
            alert(
                "La reconnaissance vocale n'est pas prise en charge par votre navigateur."
            );
        }
    };

    return (
        <>
            <div className="bg-white p-8 shadow-xl rounded-xl max-w-3xl mx-auto mt-32">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Moteur de Recherche de Recette
                </h1>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher de recette"
                        value={destinationInput}
                        onChange={(e) => setDestinationInput(e.target.value)}
                        className="flex-grow p-4 border border-gray-300 rounded-lg"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
                    >
                        Rechercher
                    </button>
                    <button
                        onClick={startListening}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded"
                    >
                        <MicrophoneIcon className="h-6 w-6" />
                    </button>
                </div>
                {loading && (
                    <div className="text-gray-500">Chargement en cours...</div>
                )}
                <ul className="list-disc pl-5">
                    {response.map((item, index) => (
                        <li key={index} className="text-gray-800">
                            {item}
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <button
                        onClick={Save}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
                    >
                        Ajouter aux recettes du site
                    </button>
                </div>
            </div>
            <Chatbot />
        </>
    );
}

export default Recherche;

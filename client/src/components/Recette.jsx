import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Recette() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get("http://localhost:3000/recipes");

            setRecipes(response.data);
        };

        fetchRecipes();
    }, []);

    return (
        <div className="Recette">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                    <li
                        key={recipe.id}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                    >
                        <div className="p-4">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                {recipe.name.replace(/:/g, "")}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {recipe.description}
                            </p>
                            <Link
                                to={`/recipe-details/${recipe.id}`}
                                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Détails
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recette;

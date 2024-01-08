import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Recette() {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${apiUrl}/recipes`);
                console.log(response.data);
                setRecipes(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecipes();
        setIsLoading(false);
    }, [apiUrl]);

    return (
        <div className="Recette">
            {isLoading ? (
                <p>Chargement...</p>
            ) : recipes.length > 0 ? (
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
                                    to={`/recettes-details/${recipe.id}`}
                                    className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Détails
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center">Aucune recette trouvée</p>
            )}
        </div>
    );
}

export default Recette;

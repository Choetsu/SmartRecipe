import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";

function RecetteDetails() {
    const [recipe, setRecipe] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const recipeId = useParams().id;
    const userId = localStorage.getItem("userId");

    const [isFavorite, setIsFavorite] = React.useState(false);

    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState("");

    const checkIfFavorite = async () => {
        try {
            const favoriteResponse = await axios.get(
                `http://localhost:3000/users/favorite-recipes/${userId}`
            );
            const favoriteRecipes = favoriteResponse.data;

            favoriteRecipes.forEach((favoriteRecipe) => {
                if (favoriteRecipe.id === recipeId) {
                    setIsFavorite(true);
                }
            });
        } catch (error) {
            console.error("Erreur lors de la vérification des favoris:", error);
        }
    };

    React.useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                const recipeResponse = await axios.get(
                    `http://localhost:3000/recipes/${recipeId}`
                );
                setRecipe(recipeResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (userId) {
            checkIfFavorite();
        }

        fetchRecipeData();
        setIsLoading(false);
    }, [recipeId, userId]);

    const addToFavorites = async () => {
        try {
            await axios.post(
                `http://localhost:3000/users/add-favorite-recipe`,
                {
                    recipeId: recipeId,
                    userId: userId,
                }
            );
            setIsFavorite(true);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromFavorites = async () => {
        try {
            await axios({
                method: "delete",
                url: `http://localhost:3000/users/remove-favorite-recipe/${recipeId}`,
                data: {
                    userId: userId,
                },
            });
            setIsFavorite(false);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async () => {
        if (isFavorite) {
            await removeFromFavorites();
        } else {
            await addToFavorites();
        }
    };

    const handleRatingSubmit = async () => {
        // Logique pour envoyer la note et le commentaire à l'API
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {isLoading ? (
                <p className="text-center text-gray-500">Chargement…</p>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Nom de la recette {recipe.name}
                    </h1>
                    <p className="text-gray-700 text-lg mb-2">
                        {recipe.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Instructions
                            </h3>
                            <p className="text-gray-600">
                                {recipe.instruction}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Ingrédients
                            </h3>
                            <p className="text-gray-600">{recipe.ingredient}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <p>Temps de préparation {recipe.preparation_time}</p>
                        <p>Temps de cuisson {recipe.cooking_time}</p>
                        <p>Catégorie {recipe.categorie}</p>
                    </div>
                    <button
                        onClick={toggleFavorite}
                        className="mt-4 flex items-center justify-center p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300"
                    >
                        {isFavorite ? (
                            <StarIconFilled className="h-6 w-6 text-white" />
                        ) : (
                            <StarIcon className="h-6 w-6 text-white" />
                        )}
                        <span className="text-white ml-2">Favoris</span>
                    </button>
                </>
            )}

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Laisser un avis :</h3>
                <div className="mt-2">
                    <label className="block">Note :</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    >
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-2">
                    <label className="block">Commentaire :</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <button
                    onClick={handleRatingSubmit}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Soumettre
                </button>
            </div>
        </div>
    );
}

export default RecetteDetails;

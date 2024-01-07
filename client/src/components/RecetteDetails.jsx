import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon, ShareIcon } from "@heroicons/react/24/solid";

function RecetteDetails() {
    const [recipe, setRecipe] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const recipeId = useParams().id || null;
    const userId = localStorage.getItem("userId") || null;

    const [isFavorite, setIsFavorite] = useState(false);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);

    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [isLoadingRecommend, setIsLoadingRecommend] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [recommendedAccompagnements, setRecommendedAccompagnements] =
        useState([]);
    const [isLoadingAccompagnements, setIsLoadingAccompagnements] =
        useState(false);
    const [showModalAccompagnements, setShowModalAccompagnements] =
        useState(false);

    const [groceryList, setGroceryList] = useState([]);
    const [isLoadingGroceryList, setIsLoadingGroceryList] = useState(false);
    const [showModalGroceryList, setShowModalGroceryList] = useState(false);

    const [caloricIndications, setCaloricIndications] = useState([]);
    const [isLoadingCaloricIndications, setIsLoadingCaloricIndications] =
        useState(false);
    const [showModalCaloricIndications, setShowModalCaloricIndications] =
        useState(false);

    const checkIfFavorite = useCallback(async () => {
        try {
            if (userId === null) {
                return;
            }
            const favoriteResponse = await axios.get(
                `http://localhost:4000/users/favorite-recipes/${userId}`
            );
            const favoriteRecipes = favoriteResponse.data;

            favoriteRecipes.forEach((favoriteRecipe) => {
                if (favoriteRecipe.id === recipeId) {
                    setIsFavorite(true);
                    localStorage.setItem(`favorite_${recipeId}`, "true");
                } else {
                    setIsFavorite(false);
                    localStorage.removeItem(`favorite_${recipeId}`);
                }
            });
        } catch (error) {
            console.error("Erreur lors de la vérification des favoris:", error);
        }
    }, [userId, recipeId]);

    const fetchComments = useCallback(async () => {
        try {
            const commentsResponse = await axios.get(
                `http://localhost:4000/recipe-ratings/comments/${recipeId}`
            );
            setCommentList(commentsResponse.data);
        } catch (error) {
            console.error(error);
        }
    }, [recipeId]);

    useEffect(() => {
        const isFavorite =
            localStorage.getItem(`favorite_${recipeId}`) === "true";
        setIsFavorite(isFavorite);

        const fetchRecipeData = async () => {
            try {
                if (recipeId === null) {
                    return;
                }
                const recipeResponse = await axios.get(
                    `http://localhost:4000/recipes/${recipeId}`
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
        fetchComments();
        setIsLoading(false);
    }, [recipeId, userId, checkIfFavorite, fetchComments]);

    useEffect(() => {
        checkIfFavorite();
    }, [checkIfFavorite]);

    const addToFavorites = async () => {
        try {
            await axios.post(
                `http://localhost:4000/users/add-favorite-recipe`,
                {
                    recipeId: recipeId,
                    userId: userId,
                }
            );
            setIsFavorite(true);
            localStorage.setItem(`favorite_${recipeId}`, "true");
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromFavorites = async () => {
        try {
            await axios({
                method: "delete",
                url: `http://localhost:4000/users/remove-favorite-recipe/${recipeId}`,
                data: {
                    userId: userId,
                },
            });
            setIsFavorite(false);
            localStorage.removeItem(`favorite_${recipeId}`);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async () => {
        if (userId !== null) {
            try {
                if (isFavorite) {
                    await removeFromFavorites();
                } else {
                    await addToFavorites();
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            window.location = "/login";
        }
    };

    const handleRatingSubmit = async () => {
        if (userId !== null) {
            try {
                await axios.post(
                    `http://localhost:4000/recipe-ratings/add-recipe-rating`,
                    {
                        rating: rating,
                        comment: comment,
                        user_id: userId,
                        recipe_id: recipeId,
                    }
                );
                setRating(0);
                setComment("");
                fetchComments();
            } catch (error) {
                console.error(error);
            }
        } else {
            window.location = "/login";
        }
    };
    const fetchRecommendedRecipes = async () => {
        setIsLoadingRecommend(true);
        try {
            const response = await axios.post(
                `http://localhost:4000/recommendations`,
                {
                    recommendationsInput: recipe.name,
                }
            );
            setRecommendedRecipes(response.data);
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
        setIsLoadingRecommend(false);
    };

    const fetchAccompagnements = async () => {
        setIsLoadingAccompagnements(true);
        try {
            const response = await axios.post(
                `http://localhost:4000/accompaniment`,
                {
                    accompanimentInput: recipe.name,
                }
            );
            setRecommendedAccompagnements(response.data);
            setShowModalAccompagnements(true);
        } catch (error) {
            console.error(error);
        }
        setIsLoadingAccompagnements(false);
    };

    const fetchGroceryList = async () => {
        setIsLoadingGroceryList(true);
        try {
            const response = await axios.post(
                `http://localhost:4000/grocery-list`,
                {
                    groceryListInput: recipe.name,
                }
            );
            setGroceryList(response.data);
            setShowModalGroceryList(true);
        } catch (error) {
            console.error(error);
        }
        setIsLoadingGroceryList(false);
    };

    const fetchIndicatorsCalories = async () => {
        setIsLoadingCaloricIndications(true);
        try {
            const response = await axios.post(
                `http://localhost:4000/caloric-indications`,
                {
                    caloricIndicationsInput: recipe.name,
                }
            );
            setCaloricIndications(response.data);
            setShowModalCaloricIndications(true);
        } catch (error) {
            console.error(error);
        }
        setIsLoadingCaloricIndications(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModalAccompagnements = () => {
        setShowModalAccompagnements(false);
    };

    const handleCloseModalGroceryList = () => {
        setShowModalGroceryList(false);
    };

    const handleCloseModalCaloricIndications = () => {
        setShowModalCaloricIndications(false);
    };

    const copyToClipboard = () => {
        const el = document.createElement("textarea");
        el.value = groceryList;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        alert("Liste de courses copiée dans le presse-papier !");
    };

    const shareByMail = () => {
        let mailtoLink =
            "mailto:?subject=" +
            encodeURIComponent("Liste de courses") +
            "&body=" +
            encodeURIComponent(groceryList);
        window.open(mailtoLink, "_blank");
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
                    <div className="flex justify-center items-center space-x-4 mt-4">
                        <button
                            onClick={toggleFavorite}
                            className="flex items-center justify-center p-2 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300"
                        >
                            {isFavorite ? (
                                <StarIconFilled className="h-6 w-6 text-white" />
                            ) : (
                                <StarIconOutline className="h-6 w-6 text-white" />
                            )}
                        </button>

                        <button
                            onClick={fetchRecommendedRecipes}
                            className="flex items-center justify-center p-2 bg-green-400 rounded-full shadow-lg hover:bg-green-500 transition duration-300"
                        >
                            <span className="text-white ml-2">
                                Recommandations
                            </span>
                        </button>
                        {isLoadingRecommend && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                            </div>
                        )}
                        {showModal && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                <div className="relative top-10 mx-auto p-5 border w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                    <div className="mt-3 text-center">
                                        <h3 className="text-xl leading-6 font-medium text-gray-900">
                                            Recommandations de Recettes
                                        </h3>
                                        <div className="mt-2 px-7 py-3">
                                            <p className="text-sm text-gray-500">
                                                Recettes similaires à{" "}
                                                {recipe.name}
                                            </p>
                                            {recommendedRecipes}
                                        </div>
                                        <div className="items-center px-4 py-3">
                                            <button
                                                onClick={handleCloseModal}
                                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={fetchAccompagnements}
                            className="flex items-center justify-center p-2 bg-blue-400 rounded-full shadow-lg hover:bg-blue-500 transition duration-300"
                        >
                            <span className="text-white ml-2">
                                Accompagnements
                            </span>
                        </button>
                        {isLoadingAccompagnements && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                            </div>
                        )}
                        {showModalAccompagnements && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                <div className="relative top-10 mx-auto p-5 border w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                    <div className="mt-3 text-center">
                                        <h3 className="text-xl leading-6 font-medium text-gray-900">
                                            Accompagnements de Recettes
                                        </h3>
                                        <div className="mt-2 px-7 py-3">
                                            <p className="text-sm text-gray-500">
                                                Accompagnement de la recette{" "}
                                                {recipe.name}
                                            </p>
                                            {recommendedAccompagnements}
                                        </div>
                                        <div className="items-center px-4 py-3">
                                            <button
                                                onClick={
                                                    handleCloseModalAccompagnements
                                                }
                                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={fetchGroceryList}
                            className="flex items-center justify-center p-2 bg-orange-400 rounded-full shadow-lg hover:bg-orange-500 transition duration-300"
                        >
                            <span className="text-white ml-2">
                                Liste de courses
                            </span>
                        </button>
                        {isLoadingGroceryList && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                            </div>
                        )}
                        {showModalGroceryList && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                <div className="relative top-10 mx-auto p-5 border w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                    <div className="mt-3 text-center">
                                        <h3 className="text-xl leading-6 font-medium text-gray-900">
                                            Liste de courses
                                        </h3>
                                        <div className="mt-2 px-7 py-3">
                                            <p className="text-sm text-gray-500">
                                                Liste de courses pour la recette{" "}
                                                {recipe.name}
                                            </p>
                                            {groceryList}
                                        </div>
                                        <div className="flex justify-around items-center mt-4">
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex items-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-700"
                                            >
                                                <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                                                Copier
                                            </button>
                                            <button
                                                onClick={shareByMail}
                                                className="flex items-center bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-700"
                                            >
                                                <ShareIcon className="h-5 w-5 mr-2" />
                                                Partager
                                            </button>
                                        </div>
                                        <div className="items-center px-4 py-3">
                                            <button
                                                onClick={
                                                    handleCloseModalGroceryList
                                                }
                                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={fetchIndicatorsCalories}
                            className="flex items-center justify-center p-2 bg-red-400 rounded-full shadow-lg hover:bg-red-500 transition duration-300"
                        >
                            <span className="text-white ml-2">
                                Indications caloriques
                            </span>
                        </button>
                        {isLoadingCaloricIndications && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                            </div>
                        )}
                        {showModalCaloricIndications && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                <div className="relative top-10 mx-auto p-5 border w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                    <div className="mt-3 text-center">
                                        <h3 className="text-xl leading-6 font-medium text-gray-900">
                                            Indications caloriques
                                        </h3>
                                        <div className="mt-2 px-7 py-3">
                                            <p className="text-sm text-gray-500">
                                                Indications caloriques pour la
                                                recette {recipe.name}
                                            </p>
                                            {caloricIndications}
                                        </div>
                                        <div className="items-center px-4 py-3">
                                            <button
                                                onClick={
                                                    handleCloseModalCaloricIndications
                                                }
                                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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

            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3">Avis :</h3>
                <ul className="list-none">
                    {commentList.map((comment) => (
                        <li
                            key={comment.id}
                            className="bg-gray-100 p-4 rounded-lg shadow mb-3"
                        >
                            <p className="text-gray-800">{comment.comment}</p>
                            <div className="text-yellow-500 text-sm">
                                Note : {comment.rating}/5
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default RecetteDetails;

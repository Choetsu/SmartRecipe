import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon, ShareIcon } from "@heroicons/react/24/solid";
import Chatbot from "./Chatbot";

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
    const apiUrl = process.env.REACT_APP_API_URL;

    const checkIfFavorite = useCallback(async () => {
        if (!userId) return;

        try {
            const favoriteResponse = await axios.get(
                `${apiUrl}/users/favorite-recipes/${userId}`
            );
            const favoriteRecipes = favoriteResponse.data;
            const isCurrentFavorite = favoriteRecipes.some((element) => {
                return (
                    element.user_recipe &&
                    element.user_recipe.recipe_id === parseInt(recipeId)
                );
            });

            setIsFavorite(isCurrentFavorite);
            localStorage.setItem(
                `favorite_${recipeId}`,
                isCurrentFavorite.toString()
            );
        } catch (error) {
            console.error("Erreur lors de la vérification des favoris:", error);
        }
    }, [userId, recipeId, apiUrl]);

    const fetchComments = useCallback(async () => {
        try {
            const commentsResponse = await axios.get(
                `${apiUrl}/recipe-ratings/comments/${recipeId}`
            );
            setCommentList(commentsResponse.data);
        } catch (error) {
            console.error(error);
        }
    }, [recipeId, apiUrl]);

    useEffect(() => {
        const isFav = localStorage.getItem(`favorite_${recipeId}`) === "true";
        setIsFavorite(isFav);

        const fetchRecipeData = async () => {
            try {
                if (recipeId === null) {
                    return;
                }
                const recipeResponse = await axios.get(
                    `${apiUrl}/recipes/${recipeId}`
                );
                setRecipe(recipeResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecipeData();
        fetchComments();
        if (userId) {
            checkIfFavorite();
        }
        setIsLoading(false);
    }, [recipeId, userId, checkIfFavorite, fetchComments, apiUrl]);

    const addToFavorites = async () => {
        try {
            await axios.post(`${apiUrl}/users/add-favorite-recipe`, {
                recipeId: recipeId,
                userId: userId,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromFavorites = async () => {
        try {
            await axios({
                method: "delete",
                url: `${apiUrl}/users/remove-favorite-recipe/${recipeId}`,
                data: {
                    userId: userId,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async () => {
        if (!userId) return (window.location = "/login");

        try {
            if (isFavorite) {
                await removeFromFavorites();
            } else {
                await addToFavorites();
            }
            setIsFavorite(!isFavorite);
            localStorage.setItem(
                `favorite_${recipeId}`,
                (!isFavorite).toString()
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleRatingSubmit = async () => {
        if (userId !== null) {
            try {
                await axios.post(`${apiUrl}/recipe-ratings/add-recipe-rating`, {
                    rating: rating,
                    comment: comment,
                    user_id: userId,
                    recipe_id: recipeId,
                });
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
            const response = await axios.post(`${apiUrl}/recommendations`, {
                recommendationsInput: recipe.name,
            });
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
            const response = await axios.post(`${apiUrl}/accompaniment`, {
                accompanimentInput: recipe.name,
            });
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
            const response = await axios.post(`${apiUrl}/grocery-list`, {
                groceryListInput: recipe.name,
            });
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
            const response = await axios.post(`${apiUrl}/caloric-indications`, {
                caloricIndicationsInput:
                    recipe.name +
                    " " +
                    recipe.ingredient +
                    " " +
                    recipe.instruction +
                    " " +
                    recipe.description,
            });
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

    const shareByTwitter = () => {
        let twitterLink =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(groceryList);
        window.open(twitterLink, "_blank");
    };

    const shareByWhatsapp = () => {
        let whatsappLink =
            "https://wa.me/?text=" + encodeURIComponent(groceryList);
        window.open(whatsappLink, "_blank");
    };

    return (
        <>
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-32">
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
                                <p className="text-gray-600">
                                    {recipe.ingredient}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                            <p>
                                Temps de préparation {recipe.preparation_time}
                            </p>
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
                                                    Liste de courses pour la
                                                    recette {recipe.name}
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
                                                <button
                                                    onClick={shareByTwitter}
                                                    className="flex items-center bg-blue-400 text-white px-3 py-2 rounded hover:bg-blue-600"
                                                >
                                                    <svg
                                                        xmlns="https://icons8.com/icon/YfCbGWCWcuar/twitterx"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M22.46 5.5C21.69 5.89 20.84 6.16 19.94 6.3C20.85 5.77 21.55 4.92 22 3.91C21.16 4.4 20.23 4.75 19.24 4.95C18.41 4.11 17.27 3.5 16 3.5C13.75 3.5 11.89 5.36 11.89 7.62C11.89 7.91 11.92 8.19 11.97 8.46C8.22 8.29 4.82 6.64 2.07 3.97C1.54 4.78 1.23 5.72 1.23 6.73C1.23 8.39 1.97 9.87 3.14 10.83C2.4 10.8 1.7 10.6 1.06 10.28C1.06 10.31 1.06 10.34 1.06 10.37C1.06 12.5 2.62 14.29 4.67 14.67C4.3 14.77 3.91 14.82 3.51 14.82C3.26 14.82 3.01 14.79 2.77 14.74C3.27 16.5 4.75 17.84 6.55 17.87C5.04 19.09 3.11 19.81 1.03 19.81C0.68 19.81 0.34 19.79 0 19.75C1.82 21 4.04 21.75 6.43 21.75C16 21.75 20.5 14.25 20.5 7.75C20.5 7.54 20.5 7.33 20.49 7.12C21.34 6.5 22.07 5.74
                                                        22.46 4.86V5.5Z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={shareByWhatsapp}
                                                    className="flex items-center bg-green-400 text-white px-3 py-2 rounded hover:bg-green-600"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        x="0px"
                                                        y="0px"
                                                        width="100"
                                                        height="100"
                                                        viewBox="0 0 48 48"
                                                    >
                                                        <path
                                                            fill="#fff"
                                                            d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                                                        ></path>
                                                        <path
                                                            fill="#fff"
                                                            d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                                                        ></path>
                                                        <path
                                                            fill="#cfd8dc"
                                                            d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                                                        ></path>
                                                        <path
                                                            fill="#40c351"
                                                            d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                                                        ></path>
                                                        <path
                                                            fill="#fff"
                                                            fill-rule="evenodd"
                                                            d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                                                            clip-rule="evenodd"
                                                        ></path>
                                                    </svg>
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
                                                    Indications caloriques pour
                                                    la recette {recipe.name}
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
                                <p className="text-gray-800">
                                    {comment.comment}
                                </p>
                                <div className="text-yellow-500 text-sm">
                                    Note : {comment.rating}/5
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Chatbot />
        </>
    );
}

export default RecetteDetails;

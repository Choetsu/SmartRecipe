import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";

function Recette() {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(9);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/recipes?page=${currentPage}&limit=${recipesPerPage}`
                );
                setRecipes(response.data.recipes);
                setTotalRecipes(response.data.total);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecipes();
        setIsLoading(false);
    }, [apiUrl, currentPage, recipesPerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <div className="mt-32">
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
                                        {recipe.name.replace(/:/g, "") ||
                                            recipe.name}
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
                <div className="flex justify-center mt-8 space-x-2">
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-4 py-2 border rounded-md ${
                                currentPage === page
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
            <Chatbot />
        </>
    );
}

export default Recette;

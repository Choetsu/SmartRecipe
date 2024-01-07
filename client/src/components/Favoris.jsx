import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Favoris() {
    const [favoris, setFavoris] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const userId = localStorage.getItem("userId");

    React.useEffect(() => {
        const fetchFavoris = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/users/favorite-recipes/${userId}`
                );
                setFavoris(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFavoris();
        setIsLoading(false);
    }, [userId]);

    return (
        <div className="Favoris bg-white p-8">
            <ul className="space-y-4">
                {favoris.map((favori) => (
                    <li
                        key={favori.id}
                        className="bg-gray-100 p-4 rounded-lg shadow"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {favori.name}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {favori.description}
                        </p>
                        <Link
                            to={`/recipe-details/${favori.id}`}
                            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Voir Détails
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Favoris;

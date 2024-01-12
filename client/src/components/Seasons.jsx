import { useState, useEffect } from "react";
import axios from "axios";
import springImage from "../assets/images/spring.jpg";
import summerImage from "../assets/images/summer.jpg";
import autumnImage from "../assets/images/autumn.jpg";
import winterImage from "../assets/images/winter.jpg";
import Chatbot from "./Chatbot";

function Seasons() {
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const preferences =
        localStorage.getItem("preferences") || "Pas de préférences";

    const seasons = [
        { name: "Printemps", image: springImage },
        { name: "Été", image: summerImage },
        { name: "Automne", image: autumnImage },
        { name: "Hiver", image: winterImage },
    ];

    useEffect(() => {
        if (selectedSeason) {
            setIsLoading(true);
            const fetchSeasons = async () => {
                try {
                    const response = await axios.post(`${apiUrl}/seasons`, {
                        seasonsInput:
                            selectedSeason +
                            "\n" +
                            "Voici les préférences de l'utilisateur a prendre en compte : " +
                            preferences,
                    });
                    setRecommendations(response.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchSeasons();
        }
    }, [selectedSeason, apiUrl, preferences]);

    return (
        <>
            <div className="mt-32">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Sélectionnez une saison pour voir les recettes de saison !
                </h1>
                <div className="flex justify-around flex-wrap">
                    {seasons.map((season) => (
                        <div
                            key={season.name}
                            className="card flex flex-col items-center bg-white rounded-lg shadow-md m-4 p-4 cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedSeason(season.name)}
                        >
                            <img
                                src={season.image}
                                alt={season.name}
                                className="h-40 w-40 object-cover rounded-full"
                            />
                            <span className="mt-2 text-lg font-semibold">
                                {season.name}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="recommendations mt-6">
                    {isLoading ? (
                        <p className="text-center">Chargement...</p>
                    ) : (
                        <div className="flex justify-around">
                            {recommendations}
                        </div>
                    )}
                </div>
            </div>
            <Chatbot />
        </>
    );
}

export default Seasons;

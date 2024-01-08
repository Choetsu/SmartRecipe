import { useState, useEffect } from "react";
import axios from "axios";
import springImage from "../assets/images/spring.jpg";
import summerImage from "../assets/images/summer.jpg";
import autumnImage from "../assets/images/autumn.jpg";
import winterImage from "../assets/images/winter.jpg";

function Seasons() {
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

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
                        seasonsInput: selectedSeason,
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
    }, [selectedSeason, apiUrl]);

    return (
        <div className="Seasons">
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
                    <div className="flex justify-around">{recommendations}</div>
                )}
            </div>
        </div>
    );
}

export default Seasons;

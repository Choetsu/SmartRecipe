import { useState, useEffect } from "react";
import Chatbot from "./Chatbot";

function Preferences() {
    const [preferences, setPreferences] = useState({
        allergies: "",
        medicalConditions: "",
    });

    useEffect(() => {
        const savedPreferences = JSON.parse(
            localStorage.getItem("preferences")
        );
        if (savedPreferences) {
            setPreferences(savedPreferences);
        }
    }, []);

    const handleInputChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const savePreferences = () => {
        localStorage.setItem("preferences", JSON.stringify(preferences));
        alert("Préférences sauvegardées !");
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-8 mt-32 bg-white shadow-md rounded">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                        Préférences Alimentaires
                    </h1>
                    <div className="mb-4">
                        <label
                            htmlFor="allergies"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Allergies
                        </label>
                        <textarea
                            id="allergies"
                            name="allergies"
                            value={preferences.allergies}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
                            placeholder="Indiquez vos allergies..."
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="medicalConditions"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Contre-indications médicales
                        </label>
                        <textarea
                            id="medicalConditions"
                            name="medicalConditions"
                            value={preferences.medicalConditions}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
                            placeholder="Indiquez vos contre-indications médicales..."
                        />
                    </div>
                    <button
                        onClick={savePreferences}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
            <Chatbot />
        </>
    );
}

export default Preferences;

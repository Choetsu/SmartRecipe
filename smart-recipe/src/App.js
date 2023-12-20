import React, { useState } from "react";
import "./App.css";
import OpenAI from "openai";

function App() {
  const [destinationInput, setDestinationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);

  const handleSearch = async () => {
    setLoading(true);

    const apiKey = //clé api openai;

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    try {
      const completions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Tu es un moteur de recherche pour les recettes de cuisine, tu dois afficher les recettes qui correspondent à la recherche de l'utilisateur. Il faut que tu donnes les ingrédients et les étapes de la recette.",
          },
          {
            role: "user",
            content: destinationInput,
          },
        ],
      });

      const apiResponse = completions.choices[0].message.content;
      // Divisez la réponse en une liste d'éléments (supposez que la réponse est séparée par des sauts de ligne)
      const responseList = apiResponse.split("\n");
      // ne pas afficher les lignes vides
      responseList.filter((item) => item !== "");
      setResponse(responseList);
    } catch (error) {
      console.error("Erreur lors de la requête à l'API OpenAI:", error);
      setResponse(["Erreur lors de la requête à l'API OpenAI"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Moteur de Recherche de Recette</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher de recette"
          value={destinationInput}
          onChange={(e) => setDestinationInput(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>
      {loading && <div>Chargement en cours...</div>}
      <ul>
        {response.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

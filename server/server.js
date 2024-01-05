const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/user");
const RecipeRouter = require("./routes/recipe");
const RecipeRatingRouter = require("./routes/recipeRating");

const { default: OpenAI } = require("openai");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.use("/users", UserRouter);
app.use("/recipes", RecipeRouter);
app.use("/recipe-ratings", RecipeRatingRouter);

app.post("/recipe-search", async (req, res) => {
    try {
        const { recipeInput } = req.body;

        const recipeSuggestions = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un moteur de recherche pour les recettes de cuisine, tu dois afficher les recettes qui correspondent à la recherche de l'utilisateur." +
                        " Il faut que tu donnes les ingrédients et les étapes de la recette." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de la recette : , Description de la recette : , Ingrédients : , Étapes de la recette : , Temps de préparation : , Temps de cuisson : , Catégorie : . Ces informations sont obligatoires et doivent suivre le format.",
                },
                {
                    role: "user",
                    content: recipeInput,
                },
            ],
        });

        res.json(recipeSuggestions.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = app;

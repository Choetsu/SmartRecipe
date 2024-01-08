const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

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
                        " Nom de la recette : , Description de la recette : , Ingrédients : , Étapes de la recette : , Temps de préparation : , Temps de cuisson : , Catégorie : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Quand l'utilisateur te donne le nom d'un plat, tu dois lui donner la recette correspondante." +
                        " Tu ne dois répondre qu'aux questions qui sont en rapport avec la cuisine.",
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

app.post("/chatbot", async (req, res) => {
    try {
        const { chatbotInput } = req.body;

        const chatbotSuggestions = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un chef étoilé au guide Michelin ayant une quinzaine d'années d'expérience dans le métier avec plusieurs concours culinaires gagnés à l'internationnal." +
                        " Tu dois répondre aux questions de l'utilisateur sur la cuisine." +
                        " Il faut que tu donnes des réponses pertinentes à l'utilisateur." +
                        " Tu ne répondras pas aux questions qui ne sont pas en rapport avec la cuisine.",
                },
                {
                    role: "user",
                    content: chatbotInput,
                },
            ],
        });

        res.json(chatbotSuggestions.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/recommendations", async (req, res) => {
    try {
        const { recommendationsInput } = req.body;

        const recommendations = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un moteur de suggestion de recettes de cuisine, tu dois afficher les recettes qui correspondent à la recherche de l'utilisateur." +
                        " Ici, tu dois recommender des recettes similaires à celle que l'utilisateur te donne." +
                        " Tu ne dois répondre que par le nom de la recette et une courte description de celle-ci." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de la recette : , Description de la recette : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Tu dois donner au moins 3 suggestions de recettes similaires à celle de l'utilisateur." +
                        " Tu ne répondras pas aux questions qui ne sont pas en rapport avec la cuisine.",
                },
                {
                    role: "user",
                    content: recommendationsInput,
                },
            ],
        });

        res.json(recommendations.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/accompaniment", async (req, res) => {
    try {
        const { accompanimentInput } = req.body;

        const accompaniment = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un moteur de suggestion de suggestions d'accompagnements pour les recettes de cuisine, tu dois afficher les suggestions d'accompagnements qui correspondent à la recherche de l'utilisateur." +
                        " Ici, tu dois recommender des suggestions d'accompagnements intelligents pour la recette que l'utilisateur te donne comme du vin, des desserts ou des fromages." +
                        " Tu ne dois répondre que par le nom de l'accompagnement et une courte description de celui-ci." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de l'accompagnement : , Description de l'accompagnement : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Tu dois donner au moins 3 suggestions d'accompagnements pour la recette de l'utilisateur." +
                        " Tu ne répondras pas aux questions qui ne sont pas en rapport avec la cuisine.",
                },
                {
                    role: "user",
                    content: accompanimentInput,
                },
            ],
        });

        res.json(accompaniment.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/grocery-list", async (req, res) => {
    try {
        const { groceryListInput } = req.body;

        const groceryList = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un moteur de suggestion de liste de courses pour les recettes de cuisine, tu dois afficher les suggestions de liste de courses qui correspondent à la recherche de l'utilisateur." +
                        " Ici, tu dois recommender des suggestions de liste de courses pour la recette que l'utilisateur te donne." +
                        " Tu ne dois répondre que par le nom de l'ingrédient et la quantité de celui-ci." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de l'ingrédient : , Quantité de l'ingrédient : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Tu dois donner la globalité des ingrédients pour la recette de l'utilisateur." +
                        " Tu ne répondras pas aux questions qui ne sont pas en rapport avec la cuisine.",
                },
                {
                    role: "user",
                    content: groceryListInput,
                },
            ],
        });

        res.json(groceryList.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/seasons", async (req, res) => {
    try {
        const { seasonsInput } = req.body;

        const seasons = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un moteur de recherche pour les recettes de cuisine, tu dois afficher les recettes qui correspondent à la recherche de l'utilisateur." +
                        " Ici, tu dois recommender des recettes de saison pour l'utilisateur (recette contenant des produits de saisons)." +
                        " Tu ne dois répondre que par le nom de la recette et une courte description de celle-ci." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de la recette : , Description de la recette : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Tu dois donner au moins 3 suggestions de recettes de saison." +
                        " Tu ne répondras pas aux questions qui ne sont pas en rapport avec la cuisine.",
                },
                {
                    role: "user",
                    content: seasonsInput,
                },
            ],
        });

        res.json(seasons.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/caloric-indications", async (req, res) => {
    try {
        const { caloricIndicationsInput } = req.body;

        const caloric = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un moteur de recherche concernant les indications caloriques pour les recettes de cuisine, tu dois afficher les indications caloriques qui correspondent à la recherche de l'utilisateur." +
                        " Ici, tu dois donner les indications caloriques pour la recette que l'utilisateur te donne." +
                        " Tu devras donner un descriptif des indications caloriques pour la recette de l'utilisateur." +
                        " Tu dois donner le nombre de calories total pour la recette." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nombre de calories : . Cette information est obligatoire et doit suivre le format." +
                        " Tu ne répondras pas aux questions qui ne sont pas en rapport avec la cuisine.",
                },
                {
                    role: "user",
                    content: caloricIndicationsInput,
                },
            ],
        });

        res.json(caloric.choices[0].message.content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

module.exports = app;

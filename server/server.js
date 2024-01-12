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
                        "Vous êtes un moteur de recherche intelligents. Vous recevez une demande de recherche de recette de cuisine, ainsi qu'un json contenant les recettes d'une API." +
                        " Votre tâche est de répondre à la demande de recherche de recette de cuisine en donnant les recettes du json qui correspondent à la recherche de l'utilisateur en priorité." +
                        " Si l'utilisateur renseigne des préférences alimentaires (allergies, régimes alimentaires, etc...), vous devez prendre en compte ces préférences pour la recherche de recette de cuisine." +
                        " Si aucune recette dans le json ne correspond à la recherche de l'utilisateur, vous devez proposer une recette vous-même qui correspond à la recherche de l'utilisateur." +
                        " La réponse doit être sous la forme suivante : " +
                        " Nom de la recette : , Description de la recette : , Ingrédients : , Etapes de la recette : , Temps de préparation : , Temps de cuisson : , Catégorie : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Vous devez donner une recette obligatoirement si la demande de l'utilisateur est en rapport avec la cuisine." +
                        " Vous ne devez pas répondre aux questions qui ne sont pas en rapport avec la cuisine.",
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
                        " Si l'utilisateur renseigne des préférences alimentaires (allergies, régimes alimentaires, etc...), vous devez prendre en compte ces préférences pour la recherche de recette de cuisine." +
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
                        " La recette que tu dois recommender doit être différente de celle de l'utilisateur et doit prendre en compte les préférences alimentaires de l'utilisateur." +
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
                        "Tu es un moteur de suggestion d'accompagnements pour les recettes de cuisine, tu dois afficher les suggestions d'accompagnements qui correspondent à la recherche de l'utilisateur." +
                        " Ici, tu dois recommender des suggestions d'accompagnements intelligentes pour la recette que l'utilisateur te donne comme du vin, des desserts ou des fromages." +
                        " Tu ne dois répondre que par le nom de l'accompagnement et une courte description de celui-ci." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de l'accompagnement : , Description de l'accompagnement : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Tu dois donner au moins 3 suggestions d'accompagnements pour la recette de l'utilisateur." +
                        " Tu dois prendre en compte les préférences alimentaires de l'utilisateur pour les suggestions d'accompagnements." +
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
                        " Tu dois prendre en compte les préférences alimentaires de l'utilisateur pour les suggestions de liste de courses." +
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
                        "Tu es un moteur de recherche pour les recettes de cuisine, tu dois afficher les recettes qui correspondent au choix de la saison de l'utilisateur (été, hivers, printemps, automner)." +
                        " Ici, tu dois recommender des recettes de saison pour l'utilisateur (recette contenant des produits de saisons)." +
                        " Tu ne dois répondre que par le nom de la recette et une courte description de celle-ci." +
                        " Tu dois donner la réponse sous la forme suivante : " +
                        " Nom de la recette : , Description de la recette : . Ces informations sont obligatoires et doivent suivre le format." +
                        " Tu dois donner au moins 3 suggestions de recettes de saison." +
                        " Tu dois prendre en compte les préférences alimentaires de l'utilisateur pour les suggestions de recettes de saison." +
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
                        " Tu partiras du principe que ce sont des indications caloriques pour une personne." +
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

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

module.exports = app;

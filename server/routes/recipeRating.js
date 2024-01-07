const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const recipeController = require("../controllers/recipeRating");
const RecipeRatingService = require("../services/recipeRating");

module.exports = new genericRouter(
    new genericController(new RecipeRatingService(), {
        customController: recipeController,
    }),
    {
        customRoutes: [
            {
                handler: "create",
                method: "post",
                path: "/add-recipe-rating",
                middleware: [],
            },
            {
                handler: "getRecipeRating",
                method: "get",
                path: "/comments/:recipeId",
                middleware: [],
            },
            {
                handler: "getRecipeRatingByUserId",
                method: "get",
                path: "/user/:userId",
                middleware: [],
            },
        ],
        defaultRoutes: false,
        middlewares: [],
    }
);

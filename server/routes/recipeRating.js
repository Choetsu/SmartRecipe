const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const recipeController = require("../controllers/recipe");
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
        ],
        defaultRoutes: {
            getOne: {
                method: "get",
                path: "/:id",
                middleware: [],
                active: true,
            },
            getAll: {
                method: "get",
                path: "/",
                middleware: [],
                active: true,
            },
            create: {
                method: "post",
                path: "/",
                middleware: [],
                active: true,
            },
        },
        middlewares: [],
    }
);

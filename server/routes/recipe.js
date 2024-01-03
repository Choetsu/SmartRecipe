const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const recipeController = require("../controllers/recipe");
const RecipeService = require("../services/recipe");

module.exports = new genericRouter(
    new genericController(new RecipeService(), {
        customController: recipeController,
    }),
    {
        customRoutes: [
            {
                handler: "create",
                method: "post",
                path: "/add-recipe",
                middleware: [],
            },
        ],
        defaultRoutes: false,
        middlewares: [],
    }
);

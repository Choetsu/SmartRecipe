const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const userController = require("../controllers/user");
const UserService = require("../services/user");

module.exports = new genericRouter(
    new genericController(new UserService(), {
        customController: userController,
    }),
    {
        customRoutes: [
            {
                handler: "login",
                method: "post",
                path: "/login",
                middleware: [],
            },
            {
                handler: "create",
                method: "post",
                path: "/register",
                middleware: [],
            },
            {
                handler: "addFavoriteRecipe",
                method: "post",
                path: "/add-favorite-recipe",
                middleware: [],
            },
            {
                handler: "removeFavoriteRecipe",
                method: "delete",
                path: "/remove-favorite-recipe/:recipeId",
                middleware: [],
            },
            {
                handler: "getFavoriteRecipes",
                method: "get",
                path: "/favorite-recipes/:userId",
                middleware: [],
            },
        ],
        defaultRoutes: false,
        middlewares: [],
    }
);

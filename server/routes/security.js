const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const securityController = require("../controllers/security");
const UserService = require("../services/user");

module.exports = new genericRouter(
    new genericController(new UserService(), {
        customController: securityController,
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
            // {
            //     handler: "logout",
            //     method: "post",
            //     path: "/logout",
            //     middleware: [],
            // },
        ],
        defaultRoutes: false,
        middlewares: [],
    }
);

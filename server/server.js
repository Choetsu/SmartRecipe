const express = require("express");
const cors = require("cors");

const UserRouter = require("./routes/user");
const RecipeRouter = require("./routes/recipe");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

app.use("/users", UserRouter);
app.use("/recipes", RecipeRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = app;

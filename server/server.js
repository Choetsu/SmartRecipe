const express = require("express");
const cors = require("cors");

const SecurityRouter = require("./routes/security");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

app.use("/users", SecurityRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = app;

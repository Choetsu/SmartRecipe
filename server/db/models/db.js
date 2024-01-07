const Sequelize = require("sequelize");
require("dotenv").config();

const connection = new Sequelize(process.env.HEROKU_POSTGRESQL_SILVER_URL, {
    logging: false,
});

connection
    .authenticate()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Unable to connect to database", err);
    });

module.exports = connection;

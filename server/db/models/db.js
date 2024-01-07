const Sequelize = require("sequelize");
require("dotenv").config();

let sequelizeOptions = {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
};

const connection = new Sequelize(
    process.env.HEROKU_POSTGRESQL_SILVER_URL,
    sequelizeOptions
);

connection
    .authenticate()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Unable to connect to database", err);
    });

module.exports = connection;

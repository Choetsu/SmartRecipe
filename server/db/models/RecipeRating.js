const Recipe = require("./Recipe");

module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class RecipeRating extends Model {
        static associate({ User, Recipe }) {
            this.belongsTo(User, {
                foreignKey: "user_id",
                as: "user",
            });
            this.belongsTo(Recipe, {
                foreignKey: "recipe_id",
                as: "recipe",
            });
        }
    }

    RecipeRating.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le commentaire est obligatoire",
                    },
                    len: {
                        args: [1, 500],
                        msg: "Le commentaire doit contenir entre 10 et 500 caractères",
                    },
                },
            },
        },
        {
            sequelize: connection,
            tableName: "recipe_rating",
        }
    );

    return RecipeRating;
};

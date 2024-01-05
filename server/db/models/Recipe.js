module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Recipe extends Model {
        static associate({ User }) {
            this.belongsToMany(User, {
                through: "user_recipe",
                foreignKey: "recipe_id",
                as: "users",
            });
        }
    }

    Recipe.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le nom est obligatoire",
                    },
                    len: {
                        args: [2, 100],
                        msg: "Le nom doit contenir entre 2 et 100 caractères",
                    },
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "La description est obligatoire",
                    },
                },
            },
            ingredient: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Les ingrédients sont obligatoires",
                    },
                },
            },
            instruction: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Les instructions sont obligatoires",
                    },
                },
            },
            preparation_time: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cooking_time: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            categorie: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Les catégories sont obligatoires",
                    },
                },
            },
        },
        {
            sequelize: connection,
            tableName: "recipe",
        }
    );

    return Recipe;
};

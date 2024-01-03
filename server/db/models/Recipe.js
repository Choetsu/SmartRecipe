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
                    len: {
                        args: [10, 500],
                        msg: "La description doit contenir entre 10 et 500 caractères",
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
                    len: {
                        args: [10, 500],
                        msg: "Les ingrédients doivent contenir entre 10 et 500 caractères",
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
                    len: {
                        args: [10, 500],
                        msg: "Les instructions doivent contenir entre 10 et 500 caractères",
                    },
                },
            },
            preparation_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: {
                        args: [1],
                        msg: "Le temps de préparation doit être supérieur à 0",
                    },
                    max: {
                        args: [1000],
                        msg: "Le temps de préparation doit être inférieur à 1000",
                    },
                },
            },
            cooking_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: {
                        args: [1],
                        msg: "Le temps de cuisson doit être supérieur à 0",
                    },
                    max: {
                        args: [1000],
                        msg: "Le temps de cuisson doit être inférieur à 1000",
                    },
                },
            },
            categorie: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Les catégories sont obligatoires",
                    },
                    len: {
                        args: [2, 100],
                        msg: "Les catégories doivent contenir entre 2 et 100 caractères",
                    },
                },
            },
            difficulty: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [2, 100],
                        msg: "La difficulté doit contenir entre 2 et 100 caractères",
                    },
                },
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrl: {
                        args: true,
                        msg: "L'image doit être une URL valide",
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

const { RecipeRating } = require("../db/models/");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = function RecipeRatingService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
                where: filters,
            };
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return RecipeRating.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return RecipeRating.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                const recipeRating = await RecipeRating.create(data);

                return recipeRating;
            } catch (e) {
                if (e instanceof Sequelize.UniqueConstraintError) {
                    throw UniqueConstraintError.fromSequelizeUniqueConstraintError(
                        e
                    );
                }
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }

                throw e;
            }
        },
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const recipeRating = await this.create(newData);
                return [[recipeRating, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, recipeRatings] = await RecipeRating.update(
                    newData,
                    {
                        where: filters,
                        returning: true,
                        individualHooks: true,
                    }
                );

                return [nbUpdated, recipeRatings];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            return RecipeRating.destroy({ where: filters });
        },
    };
};

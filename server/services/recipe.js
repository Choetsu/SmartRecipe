const { Recipe } = require("../db/models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");

module.exports = function RecipeService() {
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
            return Recipe.findAndCountAll(dbOptions);
        },
        findOne: async function (filters) {
            return Recipe.findOne({ where: filters });
        },
        create: async function (data) {
            try {
                const recipe = await Recipe.create(data);

                return recipe;
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
                const recipe = await this.create(newData);
                return [[recipe, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, recipes] = await Recipe.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });
                return [nbUpdated, recipes];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            try {
                const nbDeleted = await Recipe.destroy({ where: filters });
                return nbDeleted;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        fetchAll: async function (filters) {
            return Recipe.findAll({ where: filters });
        },
    };
};

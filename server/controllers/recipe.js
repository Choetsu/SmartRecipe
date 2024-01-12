module.exports = function RecipeController(RecipeService) {
    return {
        create: async (req, res, next) => {
            try {
                const { body } = req;
                const recipe = await RecipeService.create(body);
                return res.status(201).json(recipe);
            } catch (error) {
                if (error.constructor.name === "ValidationError") {
                    res.status(422).json(error.errors);
                } else if (error.constructor.name === "UniqueConstraintError") {
                    res.status(409).json(error.errors);
                } else {
                    console.error(error);
                    next(error);
                }
            }
        },
        findAll: async (req, res, next) => {
            try {
                const filters = req.query;
                const recipes = await RecipeService.findAll(filters);
                return res.status(200).json(recipes);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
                next(error);
            }
        },
        findAndCountAll: async (req, res, next) => {
            try {
                const { page = 1, limit = 10, ...filters } = req.query;
                const offset = (page - 1) * limit;

                const { rows: recipes, count: total } =
                    await RecipeService.findAndCountAll(filters, {
                        limit: limit,
                        offset: offset,
                    });

                return res.status(200).json({ recipes, total });
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
                next(error);
            }
        },
    };
};

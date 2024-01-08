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
                next(error);
            }
        },
    };
};

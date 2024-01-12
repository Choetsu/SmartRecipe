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
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 9;
                const offset = (page - 1) * limit;

                const filters = req.query;
                const order = req.query.order || "asc";

                const options = {
                    order: [["id", order]],
                    limit,
                    offset,
                };

                const recipes = await RecipeService.findAll(filters, options);
                return res.status(200).json(recipes);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
                next(error);
            }
        },
    };
};

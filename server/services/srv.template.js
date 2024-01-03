module.exports = function TemplateService() {
    return {
        templateFunction: async function () {
            return {
                message: "is a service template",
            };
        },
    };
};

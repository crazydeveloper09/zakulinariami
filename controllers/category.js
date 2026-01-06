import { escapeRegex } from "../helpers.js";
import Category from "../models/category.js";
import Recipe from "../models/recipe.js";

export const renderNewCategoryForm = (req, res, next) => {
    let header = `Cookiety | Przepisy | Dodaj nową kategorię`;
    res.render("./category/new", {
        header,
        recipeSubpage: "",
        currentUser: req.user,
    });
};

export const renderCategoryPage = (req, res, next) => {
    Category
        .findOne({ link: req.params.category_link })
        .exec()
        .then((category) => {
            Recipe
                .find({ categories: category._id })
                .populate(["comments", "ingredients"])
                .exec()
                .then((recipes) => {
                    Category
                        .find({})
                        .exec()
                        .then((categories) => {
                            console.log(recipes);
                            let header = `Cookiety | Przepisy | ${category.name} `;
                            res.render("./category/show", {
                                recipes,
                                category,
                                header,
                                recipeSubpage: "",
                                categories,
                                currentUser: req.user,
                            });
                        })
                        .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

export const addCategory = (req, res, next) => {
    Category
        .create({
            name: req.body.title,
            link: req.body.title.toLowerCase().split(" ").join("-"),
        })
        .then((createdCategory) => res.redirect(`/recipes/category/${createdCategory.link}`))
        .catch((err) => console.log(err));
};

export const renderCategoryEditForm = (req, res, next) => {
    Category
        .findById(req.params.category_id)
        .exec()
        .then((category) => {
            let header = `Cookiety | Przepisy | ${category.name} | Edytuj`;
            res.render("./category/edit", {
                header,
                recipeSubpage: "",
                category,
                currentUser: req.user,
            });
        })
        .catch((err) => console.log(err));
};

export const editCategory = (req, res, next) => {
    Category
        .findByIdAndUpdate(req.params.category_id, req.body.category)
        .exec()
        .then((updatedCategory) => {
            updatedCategory.link = req.body.category.name
                .toLowerCase()
                .split(" ")
                .join("-");
            updatedCategory.save();
            res.redirect(`/recipes/category/${updatedCategory.link}`);
        })
        .catch((err) => console.log(err));
};

export const deleteCategory = (req, res, next) => {
    Category
        .findByIdAndRemove(req.params.category_id)
        .exec()
        .then((updatedCategory) => res.redirect(`/recipes`))
        .catch((err) => console.log(err));
};

export const searchCategory = (req, res, next) => {
    const regex = new RegExp(escapeRegex(req.query.title), "gi");
    Recipe
        .find({
            $and: [{ title: regex }, { categories: req.query.category_id }],
        })
        .populate(["comments", "ingredients"])
        .exec()
        .then((recipes) => {
            Category
                .findOne({ link: req.params.category_link })
                .exec()
                .then((category) => {
                    Category
                        .find({})
                        .exec()
                        .then((categories) => {
                            let header = `Cookiety | Przepisy | ${category.name} | Wyszukiwanie przepisów`;
                            res.render("./category/search", {
                                header,
                                recipeSubpage: "",
                                category,
                                categories,
                                currentUser: req.user,
                                recipes,
                                param: req.query.title,
                            });
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

import Sauce from "../models/sauce.js";
import Recipe from "../models/recipe.js"

export const renderNewSauceIngredientForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj składnik sosu`;
            res.render("./sauces/new", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addSauceIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Sauce
                .create({text: req.body.text})
                .then((createdSauce) => {
                    recipe.sauces.push(createdSauce);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/sauces/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderSauceIngredientRedirectPage = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Redirect page`;
            res.render("./sauces/redirect", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderSauceIngredientEditForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Sauce
                .findById(req.params.sauce_id)
                .exec()
                .then((sauce) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj składnik sosu`;
                    res.render("./sauces/edit", {
                        header, 
                        recipeSubpage:"",
                        recipe, 
                        sauce, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editSauceIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Sauce
                .findByIdAndUpdate(req.params.sauce_id, req.body.sauce)
                .exec()
                .then((updatedSauce) => res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteSauceIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Sauce
                .findByIdAndRemove(req.params.sauce_id)
                .exec()
                .then((deletedSauce) =>  res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
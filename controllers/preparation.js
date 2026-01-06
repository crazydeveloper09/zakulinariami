import Preparation from "../models/preparation.js";
import Recipe from "../models/recipe.js"

export const renderNewPreparationForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj krok przygotowania`;
            res.render("./preparations/new", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addPreparation = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Preparation
                .create({text: req.body.text})
                .then((createdPreparation) => {
                    recipe.preparations.push(createdPreparation);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/preparations/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderPreparationRedirectPage = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Redirect page`;
            res.render("./preparations/redirect", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderPreparationEditForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Preparation
                .findById(req.params.preparation_id)
                .exec()
                .then((preparation) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj krok przygotowania`;
                    res.render("./preparations/edit", {
                        header, 
                        recipeSubpage:"",
                        recipe, 
                        preparation, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editPreparation = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Preparation
                .findByIdAndUpdate(req.params.preparation_id, req.body.preparation)
                .exec()
                .then((updatedPreparation) => res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deletePreparation = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Preparation
                .findByIdAndRemove(req.params.preparation_id)
                .exec()
                .then((deletedPreparation) =>  res.redirect(`/recipes/${recipe.link}`))
                .catch(console.log(err)) 
        })
        .catch((err) => console.log(err))
}
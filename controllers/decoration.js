import Decoration from "../models/decoration.js";
import Recipe from "../models/recipe.js"

export const renderNewDecorationIngredientForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj składnik dekoracji`;
            res.render("./decorations/new", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addDecorationIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Decoration
                .create({text: req.body.text})
                .then((createdDecoration) => {
                    recipe.decorations.push(createdDecoration);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/decorations/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderDecorationIngredientRedirectPage = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Redirect page`;
            res.render("./decorations/redirect", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderDecorationIngredientEditForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Decoration
                .findById(req.params.decoration_id)
                .exec()
                .then((decoration) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj składnik dekoracji`;
                    res.render("./decorations/edit", {
                        header, 
                        recipeSubpage:"",
                        recipe, 
                        decoration, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editDecorationIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Decoration
                .findByIdAndUpdate(req.params.decoration_id, req.body.decoration)
                .exec()
                .then((updatedDecoration) => res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteDecorationIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Decoration
                .findByIdAndRemove(req.params.decoration_id)
                .exec()
                .then((deletedDecoration) =>  res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
import Ingredient from "../models/ingredients.js";
import Recipe from "../models/recipe.js"

export const renderNewIngredientForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj składnik`;
            res.render("./ingredients/new", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Ingredient
                .create({text: req.body.text})
                .then((createdIngredient) => {
                    recipe.ingredients.push(createdIngredient);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/ingredients/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderIngredientRedirectPage = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Redirect page`;
            res.render("./ingredients/redirect", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderIngredientEditForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Ingredient
                .findById(req.params.ingredient_id)
                .exec()
                .then((ingredient) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj składnik`;
                    res.render("./ingredients/edit", {
                        header, 
                        recipeSubpage:"",
                        recipe, 
                        ingredient, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Ingredient
                .findByIdAndUpdate(req.params.ingredient_id, req.body.ingredient)
                .exec()
                .then((updatedIngredient) => res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Ingredient
                .findByIdAndRemove(req.params.ingredient_id)
                .exec()
                .then((deletedIngredient) =>  res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
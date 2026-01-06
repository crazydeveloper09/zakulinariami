import Recipe from "../models/recipe.js"

export const renderNewCheeseIngredientForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj składnik sera`;
            res.render("./cheese/new", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addCheeseIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Cheese
                .create({text: req.body.text})
                .then((createdCheese) => {
                    recipe.cheese.push(createdCheese);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/cheese/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderCheeseIngredientRedirectPage = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Redirect page`;
            res.render("./cheese/redirect", {
                header, 
                recipeSubpage:"",
                recipe, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderCheeseIngredientEditForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Cheese
                .findById(req.params.cheese_id)
                .exec()
                .then((cheese) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj składnik sera`;
                    res.render("./cheese/edit", {
                        header, 
                        recipeSubpage:"",
                        recipe, 
                        cheese, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editCheeseIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Cheese
                .findByIdAndUpdate(req.params.cheese_id, req.body.cheese)
                .exec()
                .then((updatedCheese) => res.redirect(`/recipes/${recipe.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteCheeseIngredient = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            Cheese
                .findByIdAndRemove(req.params.cheese_id)
                .exec()
                .then((deletedCheese) =>  res.redirect(`/recipes/${recipe.link}`))
                .catch(console.log(err)) 
        })
        .catch((err) => console.log(err))
}
const express = require("express"),
    Ingredient = require("../models/ingredients"),
    Recipe = require("../models/recipe"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router({mergeParams: true});
app.use(flash());
app.use(methodOverride("_method"));


router.get("/redirect", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Redirect page`;
            res.render("./ingredients/redirect", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.get("/add", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj składnik`;
            res.render("./ingredients/new", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            
            Ingredient.create({text: req.body.text}, (err, createdIngredient) => {
                if(err) {
                   console.log(err);
                } else {
                    recipe.ingredients.push(createdIngredient);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/ingredients/redirect`);
                }
           })
        }
    })
});

router.get("/:ingredient_id/edit", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Ingredient.findById(req.params.ingredient_id, (err, ingredient) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj składnik`;
                    res.render("./ingredients/edit", {header: header, recipeSubpage:"",recipe: recipe, ingredient: ingredient, currentUser: req.user})
                }
            })
        }
       
    })
   
 });
 
 router.put("/:ingredient_id", isLoggedIn, (req, res) => {
     Recipe.findById(req.params.recipe_id, (err, recipe) => {
         if(err) {
             console.log(err)
         } else {
            Ingredient.findByIdAndUpdate(req.params.ingredient_id, req.body.ingredient, (err, updatedIngredient) => {
                 if(err){
                     console.log(err);
                 } else {
                     res.redirect(`/recipes/${recipe.link}`);
                 }
             })
         }
     })
   
 });
 
 router.get("/:ingredient_id/delete", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Ingredient.findByIdAndRemove(req.params.ingredient_id, (err, removedIngredient) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/recipes/${recipe.link}`);
                }
            })
        }
    })
   
 })

 function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect("/");
}

module.exports = router;
const express = require("express"),
    Preparation = require("../models/preparation"),
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
            res.render("./preparations/redirect", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.get("/add", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj krok przygotowania`;
            res.render("./preparations/new", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
           Preparation.create({text: req.body.text}, (err, createdPrepation) => {
                if(err) {
                   console.log(err);
                } else {
                    recipe.preparations.push(createdPrepation);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/preparations/redirect`);
                }
           })
        }
    })
})


router.get("/:preparation_id/edit", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Preparation.findById(req.params.preparation_id, (err, preparation) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj krok przygotowania`;
                    res.render("./preparations/edit", {header: header, recipeSubpage:"",recipe: recipe, preparation:preparation, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:preparation_id", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Preparation.findByIdAndUpdate(req.params.preparation_id, req.body.preparation, (err, updatedPreparation) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/recipes/${recipe.link}`);
                }
            })
        }
    })
  
});

router.get("/:preparation_id/delete", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Preparation.findByIdAndRemove(req.params.preparation_id, (err, updatedPreparation) => {
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
    res.redirect(`/home?return_route=${req._parsedOriginalUrl.path}`);
}

module.exports = router;
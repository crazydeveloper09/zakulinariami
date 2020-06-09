const express = require("express"),
    Sauce = require("../models/sauce"),
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
            res.render("./sauce/redirect", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.get("/add", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj składnik sosu`;
            res.render("./sauce/new", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
           Sauce.create({text: req.body.text}, (err, createdSauce) => {
                if(err) {
                   console.log(err);
                } else {
                    recipe.sauce.push(createdSauce);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/sauce/redirect`);
                }
           })
        }
    })
})


router.get("/:sauce_id/edit", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Sauce.findById(req.params.sauce_id, (err, sauce) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj składnik sosu`;
                    res.render("./sauce/edit", {header: header, recipeSubpage:"",recipe: recipe, sauce:sauce, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:sauce_id", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Sauce.findByIdAndUpdate(req.params.sauce_id, req.body.sauce, (err, updatedSauce) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/recipes/${recipe.link}`);
                }
            })
        }
    })
  
});

router.get("/:sauce_id/delete", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Sauce.findByIdAndRemove(req.params.sauce_id, (err, updatedSauce) => {
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
    res.redirect(`/?return_route=${req._parsedOriginalUrl.path}`);
}

module.exports = router;
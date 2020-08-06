const express = require("express"),
    Cheese = require("../models/cheese"),
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
            res.render("./cheese/redirect", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.get("/add", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj składnik sera`;
            res.render("./cheese/new", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            Cheese.create({text: req.body.text}, (err, createdcheese) => {
                if(err) {
                   console.log(err);
                } else {
                    recipe.cheese.push(createdcheese);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/cheese/redirect`);
                }
           })
        }
    })
})


router.get("/:cheese_id/edit", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Cheese.findById(req.params.cheese_id, (err, cheese) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj składnik sera`;
                    res.render("./cheese/edit", {header: header, recipeSubpage:"",recipe: recipe, cheese:cheese, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:cheese_id", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Cheese.findByIdAndUpdate(req.params.cheese_id, req.body.cheese, (err, updatedcheese) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/recipes/${recipe.link}`);
                }
            })
        }
    })
  
});

router.get("/:cheese_id/delete", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Cheese.findByIdAndRemove(req.params.cheese_id, (err, updatedcheese) => {
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
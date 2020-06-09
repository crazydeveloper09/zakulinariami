const express = require("express"),
    Decoration = require("../models/decoration"),
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
            res.render("./decorations/redirect", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.get("/add", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj składnik dekoracji`;
            res.render("./decorations/new", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err){
            console.log(err)
        } else {
           Decoration.create({text: req.body.text}, (err, createddecoration) => {
                if(err) {
                   console.log(err);
                } else {
                    recipe.decorations.push(createddecoration);
                    recipe.save();
                    res.redirect(`/recipes/${recipe._id}/decorations/redirect`);
                }
           })
        }
    })
})


router.get("/:decoration_id/edit", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Decoration.findById(req.params.decoration_id, (err, decoration) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj składnik dekoracji`;
                    res.render("./decorations/edit", {header: header, recipeSubpage:"",recipe: recipe, decoration:decoration, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:decoration_id", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Decoration.findByIdAndUpdate(req.params.decoration_id, req.body.decoration, (err, updateddecoration) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/recipes/${recipe.link}`);
                }
            })
        }
    })
  
});

router.get("/:decoration_id/delete", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipe_id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            Decoration.findByIdAndRemove(req.params.decoration_id, (err, updateddecoration) => {
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
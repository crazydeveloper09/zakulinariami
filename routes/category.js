const express = require("express"),
    Recipe = require("../models/recipe"),
    Category = require("../models/category"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router({mergeParams: true});
app.use(flash());
app.use(methodOverride("_method"));

router.get("/new", isLoggedIn, (req, res) => {
    let header = `Zakulinariami | Przepisy | Dodaj nową kategorię`;
    res.render("./category/new", {header:header, recipeSubpage:"", currentUser: req.user})
       
})

router.get("/:category_link", (req, res) => {
    Category
        .findOne({link: req.params.category_link}, (err, category) => {
            if(err) {
                console.log(err);
            } else {
                Recipe.find({categories: category._id}).populate(["comments", "ingredients"]).exec((err, recipes) => {
                    Category.find({}, (err, categories) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log(recipes);
                            let header = `Zakulinariami | Przepisy | ${category.name} `;
                            res.render("./category/show", {recipes:recipes,category: category,header:header, recipeSubpage:"", categories:categories, currentUser: req.user})
                        }
                    })
                })
                
                
            }
        })
});

router.get("/:category_id/recipes/add", isLoggedIn, (req, res) => {
    Category.findById(req.params.category_id).populate("recipes").exec((err, category) => {
        if(err) {
            console.log(err)
        } else {
            Recipe
                .find({categories: { $ne: req.params.category_id} } )
                .populate("categories")
                .exec((err, recipes) => {
                    if(err){
                        console.log(err)
                    } else {
                       
                                let header = `Zakulinariami | Przepisy | ${category.name} | Powiąż z przepisem`;
                                res.render("./category/addRecipe", {header:header, recipeSubpage:"",category:category, recipes:recipes, currentUser: req.user})
                         
                        
                    }
                })
        }
    })
})


router.post("/:category_id/recipes", isLoggedIn, (req, res) => {
    Recipe
        .findOne({$and: [{_id: req.body.recipe}, {categories: req.params.category_id}]}, (err, notAdd) => {
                if(err) {
                    console.log(err);
                } else {
                    if(notAdd){
                        
                        req.flash("error", `Nie możesz dodać ${notAdd.title} do kategorii, ponieważ już w niej jest`);
                        res.redirect("back");
                       
                    } else {
                        Category.findById(req.params.category_id, (err, category) => {
                            if(err) {
                                console.log(err.message)
                            } else {
                                Recipe
                                    .findById(req.body.recipe, (err, recipe) => {
                                        if(err){
                                            console.log(err.message)
                                        } else {
                                            recipe.categories.push(category);
                                            recipe.save();
                                            category.recipes.push(recipe);
                                            category.save();
                                            res.redirect(`/recipes/category/${category.link}`)
                                        }
                                    })
                            }
                        })
                    }
                }
            })
    
})


router.post("/", isLoggedIn, (req, res) => {
            
            Category.create({name: req.body.title, link: req.body.title.toLowerCase().split(' ').join('-')}, (err, createdCategory) => {
                if(err) {
                   console.log(err);
                } else {
                   
                    res.redirect(`/recipes/category/${createdCategory.link}`);
                }
           })
        
})


router.get("/:category_id/edit", isLoggedIn, (req, res) => {
    
            Category.findById(req.params.category_id, (err, category) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | ${category.name} | Edytuj`;
                    res.render("./category/edit", {header:header, recipeSubpage:"",category:category, currentUser: req.user})
                }
            })
       
   
});

router.put("/:category_id", isLoggedIn, (req, res) => {
   
            Category.findByIdAndUpdate(req.params.category_id, req.body.category, (err, updatedCategory) => {
                if(err){
                    console.log(err);
                } else {
                    updatedCategory.link = req.body.category.name.toLowerCase().split(' ').join('-');
                    updatedCategory.save();
                    res.redirect(`/recipes/category/${updatedCategory.link}`);
                }
            })
       
  
});

router.get("/:category_id/delete", isLoggedIn, (req, res) => {
    
            Category.findByIdAndRemove(req.params.category_id, (err, updatedCategory) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/recipes`);
                }
            })
      
  
})

router.get("/:category_link/search", function(req, res){
	const regex = new RegExp(escapeRegex(req.query.title), 'gi');
	Recipe.find({$and: [{title: regex}, {categories: req.query.category_id}]}).populate(["comments", "ingredients"]).exec(function(err, recipes){
		if(err){
			console.log(err);
		} else {
            Category
                .findOne({link: req.params.category_link})
                .exec((err, category) => {
                if(err) {
                    console.log(err);
                } else {
                    Category.find({}, (err, categories) => {
                        if(err){
                            console.log(err)
                        } else {
                            let header = `Zakulinariami | Przepisy | ${category.name} | Wyszukiwanie przepisów`;
                            res.render("./category/search", {header:header, recipeSubpage:"",category: category, categories:categories, currentUser: req.user, recipes: recipes, param: req.query.title})
                        }
                    })
                
                }
            })
			
		}
	});
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/?return_route=${req._parsedOriginalUrl.path}`);
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
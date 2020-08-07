const express = require("express"),
    Blogger = require("../models/blogger"),
    Recipe = require("../models/recipe"),
    Decoration = require("../models/decoration"),
    Comment = require("../models/comment"),
    Category = require("../models/category"),
    Picture         = require("../models/picture"),
    methodOverride = require("method-override"),
    async = require("async"), 
    app = express(),
    flash = require("connect-flash"),
    router = express.Router(),
    multer = require("multer"),
    dotenv = require("dotenv");
    dotenv.config();
    

var storage = multer.diskStorage({
filename: function(req, file, callback) {
callback(null, Date.now() + file.originalname);
}
});
var imageFilter = function (req, file, cb) {
// accept image files only
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
}
cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'syberiancats', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(flash());
app.use(methodOverride("_method"))



router.get("/advanced/search", function(req, res){
    const regex = new RegExp(escapeRegex(req.query.title), 'gi');
    if(req.query.portion === '3') {
        if(parseInt(req.query.time) === 1 ){
            Recipe
            .find({
                $and: [
                    {$or: [{title: regex}]}, 
                    {$or: [{level: req.query.level}]},
                    {$or: [{hours: {$gte: parseInt(req.query.time)}}]},
                    {$or: [{plates: {$gte: parseInt(req.query.portion)} }]} 
                ]}).populate(["comments", "ingredients"]).exec( function(err, recipes){
                if(err){
                    console.log(err);
                } else {
                    Category.find({}, (err, categories) => {
                        if(err){
                            console.log(err)
                        } else {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Więcej niż 3"
                            }
                            let header = `Zakulinariami | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { recipes: recipes, header:header, recipeSubpage:"", categories:categories, currentUser: req.user, param:params})
                        }
                    })
                    
                }
            });
        } else {
            Recipe
            .find({
                $and: [
                    {$or: [{title: regex}]}, 
                    {$or: [{level: req.query.level}]},
                    {$or: [{minutes: {$lte: parseInt(req.query.time)}}]},
                    {$or: [{plates: {$gte: parseInt(req.query.portion)} }]} 
                ]}).populate(["comments", "ingredients"]).exec(function(err, recipes){
                if(err){
                    console.log(err);
                } else {
                    Category.find({}, (err, categories) => {
                        if(err){
                            console.log(err)
                        } else {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Więcej niż 3"
                            }
                            let header = `Zakulinariami | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { recipes: recipes, header:header, recipeSubpage:"", categories:categories, currentUser: req.user, param:params})
                        }
                    })
                    
                }
            });
        }
        
    } else {
        if(parseInt(req.query.time) === 1 ){
            Recipe
            .find({
                $and: [
                    {$or: [{title: regex}]}, 
                    {$or: [{level: req.query.level}]},
                    {$or: [{hours: {$gte: parseInt(req.query.time)}}]},
                    {$or: [{plates: {$lte: parseInt(req.query.portion.split('s'))} }]} 
                ]}).populate(["comments", "ingredients"]).exec(function(err, recipes){
                if(err){
                    console.log(err);
                } else {
                    Category.find({}, (err, categories) => {
                        if(err){
                            console.log(err)
                        } else {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Mniej niż 3"
                            }
                            let header = `Zakulinariami | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { recipes: recipes, header:header, recipeSubpage:"", categories:categories, currentUser: req.user, param:params})
                        }
                    })
                    
                }
            });
        } else {
            Recipe
            .find({
                $and: [
                    {$or: [{ title: regex }]}, 
                    {$or: [{ level: req.query.level }]},
                    {$or: [{ minutes:{$lte: parseInt(req.query.time)}}]},
                    {$or: [{ plates: {$lte: parseInt(req.query.portion.split('s'))} } ]}
                ]}).populate(["comments", "ingredients"]).exec(function(err, recipes){
                if(err){
                    console.log(err);
                } else {
                    Category.find({}, (err, categories) => {
                        if(err){
                            console.log(err)
                        } else {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Mniej niż 3"
                            }
                            let header = `Zakulinariami | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { recipes: recipes, header:header, recipeSubpage:"", categories:categories, currentUser: req.user, param:params})
                        }
                    })
                    
                }
            });
        }
        
    }
	
});

router.get("/title/search", function(req, res){
	const regex = new RegExp(escapeRegex(req.query.title), 'gi');
	Recipe.find({title: regex}).populate(["comments", "ingredients"]).exec(function(err, recipes){
		if(err){
			console.log(err);
		} else {
            Category.find({}, (err, categories) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy | Wyszukiwanie dla parametru ${req.query.title}`;
                    res.render("./recipes/title", { recipes: recipes, header:header, recipeSubpage:"", categories:categories, currentUser: req.user, param:req.query.title})
                }
            })
			
		}
	});
});


router.get("/", function(req, res){
    Recipe.find({}).populate(["comments", "ingredients"]).exec(function(err, recipes){
        if(err){
            console.log(err);
        } else {
            Category.find({}, (err, categories) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Przepisy`;
                    res.render("./recipes/index", {recipes:recipes, header:header, recipeSubpage:"", categories:categories, currentUser: req.user});
                }
            })
            
        }
    });
});


router.get("/new", isLoggedIn, function(req, res){
    
        let header = `Zakulinariami | Przepisy | Nowy przepis`;
        res.render("./recipes/new", {header:header, add:""});
    
});

router.post("/",  upload.single("profile"), function(req, res){
    
            cloudinary.uploader.upload(req.file.path, function(result) {
      
                let newRecipe = new Recipe({
                    title: req.body.title,
                    description: req.body.description,
                    profile: result.secure_url,
                    pictures: [],
                    hours: req.body.hours,
                    level: req.body.level,
                    minutes: req.body.minutes,
                    plates: req.body.plates,
                    link: req.body.title.toLowerCase().split(' ').join('-'),
                });
                Recipe.create(newRecipe, function(err, createdRecipe){
                    if(err){
                        console.log(err);
                    } else {
                        Blogger.findOne({username: req.user.username}, function(err, user){
                            if(err){
                                console.log(err);
                            } else {
                                createdRecipe.author.push(user);
                                createdRecipe.save();
                                done(err, createdRecipe);
                            }
                        });
                        
                    }
                });
            });
        
    
});

router.get("/:id", function(req, res){
    Recipe
        .findOne({link: req.params.id})
        .populate(["author", "cheese", "ingredients", "preparations", "categories","products", "pictures", "sauce", "decorations"])
        .exec(function(err, recipe){
        if(err){
            console.log(err);
        } else {
            Comment.find({recipe: recipe._id}).populate(["author", "answers"]).exec(function(err, comments){ 
                if(err){
                    console.log(err);
                } else {
                    let header = `Zakulinariami | Przepisy | ${recipe.title}`;
                    res.render("./recipes/show", {currentUser: req.user, header:header, recipeSubpage:"", recipe:recipe, comments:comments});
                }
            });
           
        }
    });
});

router.get("/:id/edit/profile", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj zdjęcie główne`;
            res.render("./recipes/editP", {recipe: recipe, header:header, recipeSubpage:"", currentUser: req.user})
        }
    })
})

router.get("/:id/add/picture", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if(err) {
            console.log(err)
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj zdjęcie do galerii`;
            res.render("./recipes/addP", {recipe: recipe, header:header, recipeSubpage:"", currentUser: req.user})
        }
    })
})



router.post("/:id/edit/profile", upload.single("profile"), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Recipe.findById(req.params.id, (err, recipe) => {
            if(err) {
                console.log(err)
            } else {
                recipe.profile = result.secure_url;
                recipe.written = Date.now();
                recipe.save();
                res.redirect(`/recipes/${recipe.link}`);
            }
        })
    });
    
})

router.post("/:id/add/picture", upload.single("picture"), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Recipe.findById(req.params.id, (err, recipe) => {
            if(err) {
                console.log(err)
            } else {
                Picture.create({source: result.secure_url}, (err, createdPicture) => {
                    if(err){
                        console.log(err)
                    } else {
                        recipe.pictures.push(createdPicture);
                        recipe.written = Date.now();
                        recipe.save();
                        res.redirect(`/recipes/${recipe.link}`);
                    }
                   
                })
            }
        })
    });
    
})



router.get("/:id/edit", isLoggedIn, function(req, res){
    
        Recipe.findById(req.params.id, function(err, recipe){
            if(err){
                console.log(err);
            } else {
                let header = `Zakulinariami | Przepisy | ${recipe.title} | Edytuj`;
                res.render("./recipes/edit", {currentUser: req.user, header:header, recipeSubpage:"", recipe:recipe});
            }
        });
    

});

router.get("/:id/delete", isLoggedIn, function(req, res){
   
        Recipe.findByIdAndDelete(req.params.id, function(err, recipe){
            if(err){
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    
   
});



router.put("/:id", isLoggedIn, function(req, res){
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err){
            console.log(err);
        } else {
            updatedRecipe.written = Date.now();
            updatedRecipe.link = req.body.recipe.title.toLowerCase().split(' ').join('-');
            updatedRecipe.save();
            res.redirect("/recipes/" + updatedRecipe.link);
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/home?return_route=${req._parsedOriginalUrl.path}`);
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
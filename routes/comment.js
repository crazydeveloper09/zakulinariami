const express = require("express"),
    Blogger = require("../models/blogger"),
    Recipe = require("../models/recipe"),
    Comment = require("../models/comment"),
    Answer = require("../models/answer"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"))
router.get("/new", (req, res) => {
    Recipe.findOne({link: req.params.recipe_link}, (err, recipe) => {
        if(err) {
            console.log(err);
        } else {
            let header = `Zakulinariami | Przepisy | ${recipe.title} | Dodaj komentarz`;
            res.render("./comments/new", {header: header, recipeSubpage:"",recipe: recipe, currentUser: req.user});
        }
    });
})
router.post("/", function(req, res){
    if(req.user) {
        Comment.create({text: req.body.text}, function(err, createdComment){
            if(err){
                console.log(err);
            } else {
                Blogger.findOne({username: req.user.username}, function(err, user){
                    if(err){
                        console.log(err);
                    } else {
                        
                        Recipe.findOne({link: req.params.recipe_link}, function(err, recipe){
                            if(err) {
                                console.log(err);
                            } else {
                                createdComment.recipe.push(recipe);
                                createdComment.author.push(user);
                                createdComment.save();
                                recipe.comments.push(createdComment);
                                recipe.save();
                                res.redirect(`/recipes/${recipe.link}`);
                            }
                        });
                    }
                });
               
               
            }
        });
    } else {
        Comment.create({text: req.body.text, nickname: req.body.nickname}, function(err, createdComment){
            if(err){
                console.log(err);
            } else {
                
                        
                        Recipe.findOne({link: req.params.recipe_link}, function(err, recipe){
                            if(err) {
                                console.log(err);
                            } else {
                                createdComment.recipe.push(recipe);
                                
                                createdComment.save();
                                recipe.comments.push(createdComment);
                                recipe.save();
                                res.redirect(`/recipes/${recipe.link}`);
                            }
                        });
                   
               
            }
        });
    }
    
});

router.get("/:id/edit", isLoggedIn, function(req,res){
    Comment.findById(req.params.id).populate("author").exec(function(err, comment){
        if(comment.author[0].username === req.user.username) {
            if(err){
                console.log(err);
            } else {
                res.render("./comments/edit", {currentUser: req.user, comment: comment});
            }
           
        } else {
            res.redirect("/");
        }
       
    });
});

router.get("/:id/delete", isLoggedIn, function(req,res){
    Comment.findByIdAndDelete(req.params.id, function(err, comment){
        if(comment.author[0].username === req.user.username) {
            if(err){
                console.log(err);
            } else {
                res.redirect("/recipes/" + comment.recipe[0]._id);
            }
        } else {
            if(err) {
                console.log(err); 
            } else {
                res.redirect("/");
            }
        }
      
    });
});

router.put("/:id", isLoggedIn, function(req, res){
    Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, updatedComment){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/recipes/" + updatedComment.recipe[0]._id);
        }
    });
});

router.get("/:comment_id/answers/new", (req, res) => {
    Comment.findById(req.params.comment_id).populate(["author", "recipe"]).exec((err, comment) => {
        if(err) {
            console.log(err);
        } else {
            let header = `Zakulinariami | Przepisy | ${comment.recipe.title} | Komentarz | ${comment._id} | Dodaj odpowiedź`;
            res.render("./answers/new", {header: header, recipeSubpage:"",comment: comment, currentUser: req.user});
        }
    });
});

router.get("/:comment_id/answers", (req, res) => {

    Answer
        .find({comment: req.params.comment_id})
        .populate(["author", "comment"])
        .exec((err, answers) => {
            if(err){
                console.log(err)
            } else {
                
                Comment
                    .findById(req.params.comment_id)
                    .populate(["recipe", "author"])
                    .exec(function(err, comment){
                        if(err){
                            console.log(err)
                        } else {
                            let header = `Zakulinariami | Przepisy | ${comment.recipe.title} | Komentarz | ${comment._id} | Zobacz odpowiedzi`;
                            res.render("./answers/show", {header: header, recipeSubpage:"",answers:answers, comment:comment, currentUser: req.user})
                        }
                    })
            }
        })
})

router.post("/:comment_id/answers", function(req, res){
    if(req.user) {
        Answer.create({text: req.body.text}, function(err, createdAnswer){
            if(err){
                console.log(err);
            } else {
                Blogger.findOne({username: req.user.username}, function(err, user){
                    if(err){
                        console.log(err);
                    } else {
                        
                        Comment.findById(req.params.comment_id).populate("recipe").exec(function(err, comment){
                            if(err) {
                                console.log(err);
                            } else {
                                createdAnswer.comment = comment._id;
                                createdAnswer.author = user._id;
                                createdAnswer.save();
                                
                                comment.answers.push(createdAnswer);
                                comment.save();
                                res.redirect(`/recipes/${comment.recipe.link}/comments/${req.params.comment_id}/answers`);
                            }
                        });
                    }
                });
               
               
            }
        });
    } else {
        Answer.create({text: req.body.text, nickname: req.body.nickname}, function(err, createdAnswer){
            if(err){
                console.log(err);
            } else {
                Comment.findById(req.params.comment_id).populate("recipe").exec(function(err, comment){
                    if(err) {
                        console.log(err);
                    } else {
                        createdAnswer.comment = req.params.comment_id;
                        createdAnswer.save();
                        
                        comment.answers.push(createdAnswer);
                        comment.save();
                        res.redirect(`/recipes/${comment.recipe.link}/comments/${req.params.comment_id}/answers`);
                    }
                });
               
            }
        });
    }
    
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/?return_route=${req._parsedOriginalUrl.path}`);
}


module.exports = router;
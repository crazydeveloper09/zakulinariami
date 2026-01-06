import Recipe from "../models/recipe.js";
import Comment from "../models/comment.js";
import Blogger from "../models/blogger.js";
import Answer from "../models/answer.js";

export const renderNewCommentForm = (req, res, next) => {
    Recipe
        .findOne({link: req.params.recipe_link})
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj komentarz`;
            res.render("./comments/new", {header, recipeSubpage:"",recipe: recipe, currentUser: req.user});
        })
        .catch((err) => console.log(err))
}

export const addComment = (req, res, next) => {
    if(req.user) {
        Comment
            .create({text: req.body.text})
            .then((createdComment) => {
                Blogger
                    .findOne({username: req.user.username})
                    .exec()
                    .then((user) => {
                        Recipe
                            .findOne({link: req.params.recipe_link})
                            .exec()
                            .then((recipe) => {
                                createdComment.recipe = recipe._id;
                                createdComment.author = user._id;
                                createdComment.save();
                                recipe.comments.push(createdComment);
                                recipe.save();
                                res.redirect(`/recipes/${recipe.link}`);
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    } else {
        Comment
            .create({text: req.body.text, nickname: req.body.nickname})
            .then((createdComment) => {
                Recipe
                    .findOne({link: req.params.recipe_link})
                    .exec()
                    .then((recipe) => {
                        createdComment.recipe = recipe._id;
                        createdComment.save();
                        recipe.comments.push(createdComment);
                        recipe.save();
                        res.redirect(`/recipes/${recipe.link}`);
                    })
                    .catch((err) => console.log(err)) 
            })
            .catch((err) => console.log(err)) 
    }
}

export const renderEditCommentForm = (req, res, next) => {
    Comment
        .findById(req.params.id)
        .populate("author")
        .exec()
        .then((comment) => {
            if(comment.author.username === req.user.username) {
                res.render("./comments/edit", {currentUser: req.user, comment: comment});
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => console.log(err))
}

export const deleteComment = (req, res, next) => {
    Comment
        .findByIdAndDelete(req.params.id)
        .populate("author")
        .exec()
        .then((deletedComment) => {
            if(deletedComment.author.username === req.user.username) {
                res.redirect("/recipes/" + deletedComment.recipe.link);
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => console.log(err))
}

export const editComment = (req, res, next) => {
    Comment
        .findByIdAndUpdate(req.params.id, req.body.comment)
        .exec()
        .then((updatedComment) => res.redirect("/recipes/" + updatedComment.recipe._id))
        .catch((err) => console.log(err))
}

export const renderAnswersPage = (req, res, next) => {
    Answer
        .find({comment: req.params.comment_id})
        .populate(["author", "comment"])
        .exec()
        .then((answers) => {
            Comment
                .findById(req.params.comment_id)
                .populate(["recipe", "author"])
                .exec()
                .then((comment) => {
                    let header = `Cookiety | Przepisy | ${comment.recipe.title} | Komentarz | ${comment._id} | Zobacz odpowiedzi`;
                    res.render("./answers/show", {
                        header, 
                        recipeSubpage:"",
                        answers, 
                        comment, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const renderNewAnswerForm = (req, res, next) => {
    Comment
        .findById(req.params.comment_id)
        .populate(["author", "recipe"])
        .exec()
        .then((comment) => {
            let header = `Cookiety | Przepisy | ${comment.recipe.title} | Komentarz | ${comment._id} | Dodaj odpowiedź`;
            res.render("./answers/new", {
                header, 
                recipeSubpage:"",
                comment, 
                currentUser: req.user
            });
        })
        .catch((err) => console.log(err))
}

export const addAnswer = (req, res, next) => {
    if(req.user) {
        Answer
            .create({text: req.body.text})
            .then((createdAnswer) => {
                Blogger
                    .findOne({username: req.user.username})
                    .exec()
                    .then((user) => {
                        Comment
                            .findById(req.params.comment_id)
                            .populate("recipe")
                            .exec()
                            .then((comment) => {
                                createdAnswer.comment = comment._id;
                                createdAnswer.author = user._id;
                                createdAnswer.save();
                                    
                                comment.answers.push(createdAnswer);
                                comment.save();
                                res.redirect(`/recipes/${comment.recipe.link}/comments/${req.params.comment_id}/answers`);
                            })
                            .catch((err) => console.log(err)) 
                    })
                    .catch((err) => console.log(err)) 
            })
            .catch((err) => console.log(err)) 
    } else {
        Answer
            .create({text: req.body.text, nickname: req.body.nickname})
            .then((createdAnswer) => {
                Comment
                    .findById(req.params.comment_id)
                    .populate("recipe")
                    .exec()
                    .then((comment) => {
                        createdAnswer.comment = req.params.comment_id;
                        createdAnswer.save();
                            
                        comment.answers.push(createdAnswer);
                        comment.save();
                        res.redirect(`/recipes/${comment.recipe.link}/comments/${req.params.comment_id}/answers`);
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err)) 
    }
}
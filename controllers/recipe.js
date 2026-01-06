import cloudinary from "cloudinary";
import dotenv from "dotenv";
import Recipe from "../models/recipe.js";
import Category from "../models/category.js";
import Comment from "../models/comment.js";
import Blogger from "../models/blogger.js";
import Cheese from "../models/cheese.js";
import Picture from "../models/picture.js";
import { escapeRegex, sendSimpleMessage } from "../helpers.js";
import Product from "../models/products.js";
import { adminReportTemplate } from "../emails/templates/report.js";

dotenv.config()

cloudinary.config({ 
    cloud_name: 'syberiancats', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const renderRecipeMainPage = (req, res, next) => {
    const isAdmin = req.user?.username === "Admin" ? {} : { published: true };
    Recipe
        .find(isAdmin)
        .populate(["comments", "ingredients"])
        .exec()
        .then((recipes) => {
            Category
                .find({})
                .exec()
                .then((categories) => {
                    let header = `Cookiety | Przepisy`;
                    res.render("./recipes/index", {
                        recipes, 
                        header, 
                        recipeSubpage:"", 
                        categories, 
                        currentUser: 
                        req.user
                    });
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const renderNewRecipeForm = (req, res, next) => {
    let header = `Cookiety | Przepisy | Nowy przepis`;
    res.render("./recipes/new", {
        header, 
        add:"",
        currentUser: req.user,
    });
}

export const reportRecipe = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .populate("author")
        .exec()
        .then((recipe) => {
            recipe.published = false;
            recipe.save()
            const {reason, reporterEmail} = req.body;
            const subject = "Zgłoszenie przepisu w społeczności Cookiety";
            sendSimpleMessage("support@cookiety.pl", subject, adminReportTemplate, { title: recipe.title, reason, reporterEmail })
            res.redirect("/recipes")
        })
        .catch((err) => console.log(err))
}

export const addRecipe = (req, res, next) => {
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
        Recipe
            .create(newRecipe)
            .then((createdRecipe) => {
                Blogger
                    .findOne({username: req.user.username})
                    .exec()
                    .then((user) => {
                        createdRecipe.author = user._id;
                        createdRecipe.save();
                        console.log(createdRecipe)
                        res.redirect(`/recipes/${createdRecipe.link}`)
                    })
                    .catch((err) => console.log(err)) 
            })
            .catch((err) => console.log(err)) 
    });
}

export const renderLinkRecipeProductForm = (req, res, next) => {
    Product
        .find({ recipes: { $ne: req.params.recipe_id } })
        .exec()
        .then((products) => {
            Recipe
                .findById(req.params.recipe_id)
                .exec()
                .then((recipe) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Powiąż z produktem`;
                    res.render("./recipes/addProduct", {
                        header, 
                        productSubpage:"",
                        products, 
                        recipe, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err)) 
}

export const linkProductToRecipe = (req, res, next) => {
    Recipe
        .findOne({$and: [{_id: req.params.recipe_id}, {products: req.body.product}]})
        .exec()
        .then((notAdd) => {
            if(notAdd){
                req.flash("error", `Nie możesz powiązać ${notAdd.title} z tym przepisem, ponieważ już to zrobiłeś`);
                res.redirect("back");
            } else {
                Product
                    .findById(req.body.product)
                    .exec()
                    .then((product) => {
                        Recipe
                            .findById(req.params.recipe_id)
                            .exec()
                            .then((recipe) => {
                                recipe.products.push(product);
                                recipe.save();
                                product.recipes.push(recipe);
                                product.save();
                                res.redirect(`/recipes/${recipe.link}`)
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err)) 
            }
        })
        .catch((err) => console.log(err))
}

export const renderRecipeCategoryLinkForm = (req, res, next) => {
    Category
        .find({ recipes: { $ne: req.params.recipe_id }})
        .exec()
        .then((categories) => {
            Recipe
                .findById(req.params.recipe_id)
                .exec()
                .then((recipe) => {
                    let header = `Cookiety | Przepisy | ${recipe.title} | Powiąż z kategorią`;
                    res.render("./recipes/addCategory", {
                        header,
                        recipeSubpage: "",
                        categories,
                        recipe,
                        currentUser: req.user,
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

export const addCategoryToRecipe = (req, res, next) => {
    Recipe
        .findOne({
            $and: [{ _id: req.params.recipe_id }, { categories: req.body.category }],
        })
        .exec()
        .then((notAdd) => {
            if (notAdd) {
                req.flash("error", `Nie możesz dodać ${notAdd.title} do kategorii, ponieważ już w niej jest`);
                res.redirect("back");
            } else {
                Category
                    .findById(req.body.category)
                    .exec()
                    .then((category) => {
                        Recipe
                            .findById(req.params.recipe_id)
                            .exec()
                            .then((recipe) => {
                                recipe.categories.push(category);
                                recipe.save();
                                category.recipes.push(recipe);
                                category.save();
                                res.redirect(`/recipes/${recipe.link}`);
                            })
                            .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
            }
        })
        .catch((err) => console.log(err));
};

export const publishRecipe = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            recipe.published = true;
            recipe.save();
            res.redirect("back")
        })
        .catch((err) => console.log(err))
}

export const renderRecipeShowPage = (req, res, next) => {
    Recipe
        .findOne({link: req.params.recipe_id})
        .populate(["author", "cheese", "ingredients", "preparations", "categories","products", "pictures", "sauce", "decorations"])
        .exec()
        .then((recipe) => {
            Comment
                .find({recipe: recipe._id})
                .populate(["author", "answers"])
                .exec()
                .then((comments) => {
                    let header = `Cookiety | Przepisy | ${recipe.title}`;
                    res.render("./recipes/show", {
                        currentUser: req.user, 
                        header, 
                        recipeSubpage:"", 
                        recipe, 
                        comments
                    });
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderEditRecipeForm = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj`;
            res.render("./recipes/edit", {
                currentUser: req.user, 
                header, 
                recipeSubpage:"", 
                recipe
            });
        })
        .catch((err) => console.log(err))
}

export const editRecipe = (req, res, next) => {
    Recipe
        .findByIdAndUpdate(req.params.recipe_id, req.body.recipe)
        .exec()
        .then((updatedRecipe) => {
            updatedRecipe.written = Date.now();
            updatedRecipe.link = req.body.recipe.title.toLowerCase().split(' ').join('-');
            updatedRecipe.save();
            res.redirect("/recipes/" + updatedRecipe.link);
        })
        .catch((err) => console.log(err))
}

export const deleteRecipe = (req, res, next) => {
    Recipe
        .findByIdAndDelete(req.params.recipe_id)
        .exec()
        .then((deletedRecipe) => res.redirect("/recipes"))
        .catch((err) => console.log(err))
}

export const searchRecipes = (req, res, next) => {
    const isAdmin = req.user?.username === "Admin" ? {} : { published: true };
    const regex = new RegExp(escapeRegex(req.query.title), 'gi');
    Recipe
        .find({$and: [ { title: regex }, isAdmin ]})
        .populate(["comments", "ingredients"])
        .exec((recipes) => {
            Category
                .find({})
                .exec()
                .then((categories) => {
                    let header = `Cookiety | Przepisy | Wyszukiwanie dla parametru ${req.query.title}`;
                    res.render("./recipes/title", { 
                        recipes, 
                        header, 
                        recipeSubpage:"", 
                        categories, 
                        currentUser: req.user, 
                        param:req.query.title
                    })
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const searchRecipesAdvanced = (req, res, next) => {
    const isAdmin = req.user?.username === "Admin" ? {} : { published: true };
    const regex = new RegExp(escapeRegex(req.query.title), 'gi');
    if(req.query.portion === '3') {
        if(parseInt(req.query.time) === 1 ){
            Recipe
                .find({
                    $and: [
                        {$or: [{title: regex}]}, 
                        {$or: [{level: req.query.level}]},
                        {$or: [{hours: {$gte: parseInt(req.query.time)}}]},
                        {$or: [{plates: {$gte: parseInt(req.query.portion)} }]},
                        isAdmin
                    ]})
                .populate(["comments", "ingredients"])
                .exec()
                .then((recipes) => {
                    Category
                        .find({})
                        .exec()
                        .then((categories) => {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Więcej niż 3"
                            }
                            let header = `Cookiety | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { 
                                recipes, 
                                header, 
                                recipeSubpage:"", 
                                categories, 
                                currentUser: req.user, 
                                param:params
                            })
                        })
                        .catch((err) => console.log(err)) 
                })
                .catch((err) => console.log(err)) 
        } else {
            Recipe
                .find({
                    $and: [
                        {$or: [{title: regex}]}, 
                        {$or: [{level: req.query.level}]},
                        {$or: [{minutes: {$lte: parseInt(req.query.time)}}]},
                        {$or: [{plates: {$gte: parseInt(req.query.portion)} }]},
                        isAdmin 
                    ]})
                .populate(["comments", "ingredients"])
                .exec()
                .then((recipes) => {
                    Category
                        .find({})
                        .exec()
                        .then((categories) => {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Więcej niż 3"
                            }
                            let header = `Cookiety | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { 
                                recipes, 
                                header, 
                                recipeSubpage:"", 
                                categories, 
                                currentUser: req.user, 
                                param:params
                            })
                        })
                        .catch((err) => console.log(err)) 
                })
                .catch((err) => console.log(err)) 
        }
    } else {
        if(parseInt(req.query.time) === 1 ){
            Recipe
                .find({
                    $and: [
                        {$or: [{title: regex}]}, 
                        {$or: [{level: req.query.level}]},
                        {$or: [{hours: {$gte: parseInt(req.query.time)}}]},
                        {$or: [{plates: {$lte: parseInt(req.query.portion.split('s'))} }]},
                        isAdmin 
                    ]})
                .populate(["comments", "ingredients"])
                .exec()
                .then((recipes) => {
                    Category
                        .find({})
                        .exec()
                        .then((categories) => {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Mniej niż 3"
                            }
                            let header = `Cookiety | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { 
                                recipes,
                                header,
                                recipeSubpage:"", 
                                categories, 
                                currentUser: req.user, 
                                param:params
                            })
                        })
                        .catch((err) => console.log(err)) 
                })
                .catch((err) => console.log(err))
        } else {
            Recipe
                .find({
                    $and: [
                        {$or: [{ title: regex }]}, 
                        {$or: [{ level: req.query.level }]},
                        {$or: [{ minutes:{$lte: parseInt(req.query.time)}}]},
                        {$or: [{ plates: {$lte: parseInt(req.query.portion.split('s'))} } ]},
                        isAdmin
                    ]})
                .populate(["comments", "ingredients"])
                .exec()
                .then((recipes) => {
                    Category
                        .find({})
                        .exec()
                        .then((categories) => {
                            let params = {
                                title: req.query.title,
                                level: req.query.level,
                                time: req.query.time,
                                portion: "Mniej niż 3"
                            }
                            let header = `Cookiety | Przepisy | Zaawansowana wyszukiwarka`;
                            res.render("./recipes/advanced", { 
                                recipes, 
                                header, 
                                recipeSubpage:"", 
                                categories, 
                                currentUser: req.user, 
                                param:params
                            })
                        })
                        .catch((err) => console.log(err))
                })
                .catch((err) => console.log(err)) 
        }
    }
}

export const renderEditRecipeProfilePicture = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Edytuj zdjęcie główne`;
            res.render("./recipes/editP", {
                recipe, 
                header, 
                recipeSubpage:"", 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const editRecipeProfilePicture = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Recipe
            .findById(req.params.recipe_id)
            .exec()
            .then((recipe) => {
                recipe.profile = result.secure_url;
                recipe.written = Date.now();
                recipe.save();
                res.redirect(`/recipes/${recipe.link}`);
            })
            .catch((err) => console.log(err))
    });
}

export const renderAddPhotoToRecipeGallery = (req, res, next) => {
    Recipe
        .findById(req.params.recipe_id)
        .exec()
        .then((recipe) => {
            let header = `Cookiety | Przepisy | ${recipe.title} | Dodaj zdjęcie do galerii`;
            res.render("./recipes/editP", {
                recipe, 
                header, 
                recipeSubpage:"", 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addPhotoToRecipeGallery = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Recipe
            .findById(req.params.recipe_id)
            .exec()
            .then((recipe) => {
                Picture
                    .create({source: result.secure_url})
                    .then((createdPicture) => {
                        recipe.pictures.push(createdPicture);
                        recipe.written = Date.now();
                        recipe.save();
                        res.redirect(`/recipes/${recipe.link}`);
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    });
}
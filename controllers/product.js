import cloudinary from "cloudinary";
import dotenv from "dotenv";
import Product from "../models/products.js";
import { escapeRegex, sendSimpleMessage } from "../helpers.js";
import { adminReportTemplate } from "../emails/templates/report.js";

dotenv.config()

cloudinary.config({ 
  cloud_name: 'syberiancats', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const renderProductMainPage = (req, res, next) => {
    const isAdmin = req.user?.username === "Admin" ? {} : { published: true };
    Product
        .find(isAdmin)
        .populate("whyToAvoid")
        .exec()
        .then((products) => {
            let header = `Cookiety | Produkty`;
            res.render("./products/index", {
                header, 
                productSubpage:"",
                products, 
                currentUser: req.user
            });
        })
        .catch((err) => console.log(err))
}

export const renderNewProductForm = (req, res, next) => {
    let header = `Cookiety | Produkty | Dodaj produkt`;
    res.render("./products/new", {
        header, 
        productSubpage:"",
        currentUser: req.user
    });
}

export const createProduct = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        let newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            profile: result.secure_url,
            link: req.body.title.toLowerCase().split(' ').join('-'),
        });
        Product
            .create(newProduct)
            .then((createdProduct) => res.redirect(`/products/${createdProduct.link}`))
            .catch((err) => console.log(err))
    });
}

export const renderLinkProductRecipeForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Recipe
                .find({ products: { $ne: req.params.product_id }})
                .populate("products")
                .exec()
                .then((recipes) => {
                    let header = `Cookiety | Produkty | ${product.title} | Powiąż z przepisem`;
                    res.render("./products/addRecipe", {
                        header, 
                        productSubpage:"",
                        product, 
                        recipes, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err)) 
}

export const linkProductToRecipe = (req, res, next) => {
    Recipe
        .findOne({$and: [{_id: req.body.recipe}, {products: req.params.product_id}]})
        .exec()
        .then((notAdd) => {
            if(notAdd){
                req.flash("error", `Nie możesz powiązać ${notAdd.title} z tym przepisem, ponieważ już to zrobiłeś`);
                res.redirect("back");
            } else {
                Product
                    .findById(req.params.product_id)
                    .exec()
                    .then((product) => {
                        Recipe
                            .findById(req.body.recipe)
                            .exec()
                            .then((recipe) => {
                                recipe.products.push(product);
                                recipe.save();
                                product.recipes.push(recipe);
                                product.save();
                                res.redirect(`/products/${product.link}`)
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err)) 
            }
        })
        .catch((err) => console.log(err))
}

export const renderProductShowPage = (req, res, next) => {
    Product
        .findOne({link: req.params.link})
        .populate(["whyToEat", "recipes", "pictures","whyToAvoid", "substitutes"])
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title}`;
            res.render("./products/show", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user 
            });
        })
        .catch((err) => console.log(err))
}

export const renderEditProductForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Edytuj`;
            res.render("./products/edit", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            });
        })
        .catch((err) => console.log(err))
}

export const publishProduct = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            product.published = true;
            product.save();
            res.redirect(`/products/${product.link}`)
        })
        .catch((err) => console.log(err))
}

export const editProduct = (req, res, next) => {
    Product
        .findByIdAndUpdate(req.params.product_id, req.body.product)
        .exec()
        .then((updatedProduct) => {
            updatedProduct.link = req.body.product.title.toLowerCase().split(' ').join('-');
            updatedProduct.save();
            res.redirect(`/products/${updatedProduct.link}`);
        })
        .catch((err) => console.log(err))
}

export const deleteProduct = (req, res, next) => {
    Product
        .findByIdAndRemove(req.params.product_id)
        .exec()
        .then((deletedProduct) => res.redirect(`/products`))
        .catch((err) => console.log(err))
}

export const searchProducts = (req, res, next) => {
    const isAdmin = req.user?.username === "Admin" ? {} : { published: true };
    const regex = new RegExp(escapeRegex(req.query.title), 'gi');
	Product
        .find({ $and: [ {title: regex}, isAdmin ] })
        .populate("whyToAvoid")
        .exec()
        .then((products) => {
            let header = `Cookiety | Produkty | Wyszukiwanie po parametrze ${req.query.title}`;
            res.render("./products/search", {
                header, 
                productSubpage: "", 
                products, 
                currentUser: req.user, 
                param: req.query.title
            })
        })
        .catch((err) => console.log(err))
}

export const renderEditProductProfilePicture = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Edytuj zdjęcie główne`;
            res.render("./products/editP", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const reportProduct = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            product.published = false;
            product.save()
            const {reason, reporterEmail} = req.body;
            const subject = "Zgłoszenie produktu w społeczności Cookiety";
            sendSimpleMessage("support@cookiety.pl", subject, adminReportTemplate, { title: product.title, reason, reporterEmail })
            res.redirect("/products")
        })
        .catch((err) => console.log(err))
}

export const editProductProfilePicture = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            product.profile = result.secure_url;
            product.save();
            res.redirect(`/products/${product.link}`);
        })
        .catch((err) => console.log(err))
    });
}

export const renderAddPhotoToProductGallery = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Dodaj zdjęcie do galerii`;
            res.render("./products/editP", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addPhotoToProductGallery = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Product
            .findById(req.params.product_id)
            .exec()
            .then((product) => {
                Picture
                    .create({ source: result.secure_url })
                    .then((createdPicture) => {
                        product.pictures.push(createdPicture);
                        product.save();
                        res.redirect(`/products/${product.link}`);
                    })
                    .catch((err) => console.log(err)) 
            })
            .catch((err) => console.log(err))
    });
}
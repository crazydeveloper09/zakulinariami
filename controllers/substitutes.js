import Substitute from "../models/substitute.js";
import Product from "../models/products.js"

export const renderNewSubstituteForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Dodaj zamiennik`;
            res.render("./substitutes/new", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addSubstitute = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Substitute
                .create({text: req.body.text})
                .then((createdSubstitute) => {
                    product.substitutes.push(createdSubstitute);
                    product.save();
                    res.redirect(`/products/${product._id}/substitutes/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderSubstituteRedirectPage = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Redirect page`;
            res.render("./substitutes/redirect", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderSubstituteEditForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Substitute
                .findById(req.params.substitute_id)
                .exec()
                .then((substitute) => {
                    let header = `Cookiety | Produkty | ${product.title} | Edytuj zamiennik`;
                    res.render("./substitutes/edit", {
                        header, 
                        productSubpage:"",
                        product, 
                        substitute, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editSubstitute = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Substitute
                .findByIdAndUpdate(req.params.substitute_id, req.body.substitute)
                .exec()
                .then((updatedSubstitute) => res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteSubstitute = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Substitute
                .findByIdAndRemove(req.params.substitute_id)
                .exec()
                .then((deletedSubstitute) =>  res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
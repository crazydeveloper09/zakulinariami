import WhyToEat from "../models/whyToEat.js";
import Product from "../models/products.js"

export const renderNewWhyToEatForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Dodaj powód dlaczego warto jeść`;
            res.render("./whyToEat/new", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addWhyToEat = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToEat
                .create({text: req.body.text})
                .then((createdWhyToEat) => {
                    product.whyToEat.push(createdWhyToEat);
                    product.save();
                    res.redirect(`/products/${product._id}/whyToEat/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderWhyToEatRedirectPage = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Redirect page`;
            res.render("./whyToEat/redirect", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderWhyToEatEditForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToEat
                .findById(req.params.whyToEat_id)
                .exec()
                .then((whyToEat) => {
                    let header = `Cookiety | Produkty | ${product.title} | Edytuj powód dlaczego warto jeść`;
                    res.render("./whyToEat/edit", {
                        header, 
                        productSubpage:"",
                        product, 
                        whyToEat, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editWhyToEat = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToEat
                .findByIdAndUpdate(req.params.whyToEat_id, req.body.whyToEat)
                .exec()
                .then((updatedWhyToEat) => res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteWhyToEat = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToEat
                .findByIdAndRemove(req.params.whyToEat_id)
                .exec()
                .then((deletedWhyToEat) =>  res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
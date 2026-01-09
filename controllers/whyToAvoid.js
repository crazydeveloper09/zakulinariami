import WhyToAvoid from "../models/whyToAvoid.js";
import Product from "../models/products.js"

export const renderNewWhyToAvoidForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Dodaj powód dlaczego unikać`;
            res.render("./whyToAvoid/new", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addWhyToAvoid = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToAvoid
                .create({text: req.body.text})
                .then((createdWhyToAvoid) => {
                    product.whyToAvoid.push(createdWhyToAvoid);
                    product.save();
                    res.redirect(`/products/${product._id}/whyToAvoid/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderWhyToAvoidRedirectPage = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Redirect page`;
            res.render("./whyToAvoid/redirect", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderWhyToAvoidEditForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToAvoid
                .findById(req.params.whyToAvoid_id)
                .exec()
                .then((whyToAvoid) => {
                    let header = `Cookiety | Produkty | ${product.title} | Edytuj powód dlaczego unikać`;
                    res.render("./whyToAvoid/edit", {
                        header, 
                        productSubpage:"",
                        product, 
                        whyToAvoid, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editWhyToAvoid = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToAvoid
                .findByIdAndUpdate(req.params.whyToAvoid_id, req.body.whyToAvoid)
                .exec()
                .then((updatedWhyToAvoid) => res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deleteWhyToAvoid = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            WhyToAvoid
                .findByIdAndRemove(req.params.whyToAvoid_id)
                .exec()
                .then((deletedWhyToAvoid) =>  res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
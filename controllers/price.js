import Price from "../models/price.js";
import Product from "../models/products.js"

export const renderNewPriceForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Dodaj cenę w danym sklepie`;
            res.render("./prices/new", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const addPrice = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Price
                .create({shopName: req.body.shopName, amount: req.body.amount})
                .then((createdPrice) => {
                    product.prices.push(createdPrice);
                    product.save();
                    res.redirect(`/products/${product._id}/prices/redirect`);
                })
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const renderPriceRedirectPage = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            let header = `Cookiety | Produkty | ${product.title} | Redirect page`;
            res.render("./prices/redirect", {
                header, 
                productSubpage:"",
                product, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const renderPriceEditForm = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Price
                .findById(req.params.price_id)
                .exec()
                .then((price) => {
                    let header = `Cookiety | Produkty | ${product.title} | Edytuj cenę w danym sklepie`;
                    res.render("./prices/edit", {
                        header, 
                        productSubpage:"",
                        product, 
                        price, 
                        currentUser: req.user
                    })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const editPrice = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Price
                .findByIdAndUpdate(req.params.price_id, req.body.price)
                .exec()
                .then((updatedPrice) => res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}

export const deletePrice = (req, res, next) => {
    Product
        .findById(req.params.product_id)
        .exec()
        .then((product) => {
            Price
                .findByIdAndRemove(req.params.price_id)
                .exec()
                .then((deletedPrice) =>  res.redirect(`/products/${product.link}`))
                .catch((err) => console.log(err)) 
        })
        .catch((err) => console.log(err))
}
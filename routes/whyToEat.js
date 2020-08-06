const express = require("express"),
    Product = require("../models/products"),
    WhyToEat = require("../models/whyToEat"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router({mergeParams: true});
app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Redirect page`;
            res.render("./whyToEat/redirect", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.get("/new", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Dodaj powód do jedzenia`;
            res.render("./whyToEat/new", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err)
        } else {
           WhyToEat.create({text: req.body.text}, (err, createdWhyToEat) => {
                if(err) {
                   console.log(err);
                } else {
                    product.whyToEat.push(createdWhyToEat);
                    product.save();
                    res.redirect(`/products/${product._id}/whyToEat/redirect`);
                }
           })
        }
    })
})


router.get("/:whyToEat_id/edit", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            WhyToEat.findById(req.params.whyToEat_id, (err, whyToEat) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Produkty | ${product.title} | Edytuj powód do jedzenia`;
                    res.render("./whyToEat/edit", {header:header, productSubpage:"",product: product, whyToEat:whyToEat, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:whyToEat_id", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            WhyToEat.findByIdAndUpdate(req.params.whyToEat_id, req.body.whyToEat, (err, updatedwhyToEat) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/products/${product.link}`);
                }
            })
        }
    })
  
});

router.get("/:whyToEat_id/delete", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            WhyToEat.findByIdAndRemove(req.params.whyToEat_id, (err, updatedwhyToEat) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/products/${product.link}`);
                }
            })
        }
    })
  
})



function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/home?return_route=${req._parsedOriginalUrl.path}`);
}
module.exports = router;
const express = require("express"),
    Product = require("../models/products"),
    WhyToAvoid = require("../models/whyToAvoid"),
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
            res.render("./whyToAvoid/redirect", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.get("/new", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Dodaj powód do jedzenia`;
            res.render("./whyToAvoid/new", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err)
        } else {
           WhyToAvoid.create({text: req.body.text}, (err, createdWhyToAvoid) => {
                if(err) {
                   console.log(err);
                } else {
                    product.whyToAvoid.push(createdWhyToAvoid);
                    product.save();
                    res.redirect(`/products/${product._id}/whyToAvoid/redirect`);
                }
           })
        }
    })
})


router.get("/:whyToAvoid_id/edit", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            WhyToAvoid.findById(req.params.whyToAvoid_id, (err, whyToAvoid) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Produkty | ${product.title} | Edytuj powód do unikania`;
                    res.render("./whyToAvoid/edit", {header:header, productSubpage:"",product: product, whyToAvoid:whyToAvoid, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:whyToAvoid_id", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            WhyToAvoid.findByIdAndUpdate(req.params.whyToAvoid_id, req.body.whyToAvoid, (err, updatedwhyToAvoid) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/products/${product.link}`);
                }
            })
        }
    })
  
});

router.get("/:whyToAvoid_id/delete", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            WhyToAvoid.findByIdAndRemove(req.params.whyToAvoid_id, (err, updatedwhyToAvoid) => {
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
    res.redirect(`/?return_route=${req._parsedOriginalUrl.path}`);
}
module.exports = router;
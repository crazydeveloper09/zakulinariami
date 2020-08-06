const express = require("express"),
    Product = require("../models/products"),
    Substitute = require("../models/substitute"),
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
            res.render("./substitutes/redirect", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.get("/new", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Dodaj powód do jedzenia`;
            res.render("./substitutes/new", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err){
            console.log(err);
        } else {
           Substitute.create({text: req.body.text}, (err, createdsubstitute) => {
                if(err) {
                   console.log(err);
                } else {
                    console.log(createdsubstitute);
                    product.substitutes.push(createdsubstitute);
                    product.save();
                    res.redirect(`/products/${product._id}/substitutes/redirect`);
                }
           })
        }
    })
})


router.get("/:substitute_id/edit", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            Substitute.findById(req.params.substitute_id, (err, substitute) => {
                if(err){
                    console.log(err)
                } else {
                    let header = `Zakulinariami | Produkty | ${product.title} | Edytuj zamiennik`;
                    res.render("./substitutes/edit", {header:header, productSubpage:"",product: product, substitute:substitute, currentUser: req.user})
                }
            })
        }
    });
   
});

router.put("/:substitute_id", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            Substitute.findByIdAndUpdate(req.params.substitute_id, req.body.substitute, (err, updatedsubstitute) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/products/${product.link}`);
                }
            })
        }
    })
  
});

router.get("/:substitute_id/delete", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            Substitute.findByIdAndRemove(req.params.substitute_id, (err, updatedsubstitute) => {
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
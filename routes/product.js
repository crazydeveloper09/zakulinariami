const express = require("express"),
    Product = require("../models/products"),
    Recipe = require("../models/recipe"),
    Picture         = require("../models/picture"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router(),
    multer = require("multer"),
    dotenv = require("dotenv");
    dotenv.config();

var storage = multer.diskStorage({
filename: function(req, file, callback) {
callback(null, Date.now() + file.originalname);
}
});
var imageFilter = function (req, file, cb) {
// accept image files only
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
}
cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'syberiancats', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(flash());
app.use(methodOverride("_method"));

// Product index route
router.get("/", (req, res) => {
    Product.find({}, (err, products) => {
        if(err) {
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty`;
            res.render("./products/index", {header:header, productSubpage:"",products: products, currentUser: req.user});
        }
    })
})
// Product new page route
router.get("/new", isLoggedIn, (req,res) => {
    let header = `Zakulinariami | Produkty | Dodaj produkt`;
    res.render("./products/new", {header:header, productSubpage:"",currentUser: req.user});
})

// Product new post route

router.post("/", upload.single("profile"), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        let newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            profile: result.secure_url,
            link: req.body.title.toLowerCase().split(' ').join('-'),
        });
        Product.create(newProduct, function(err, createdProduct){
            if(err){
                console.log(err);
            } else {
               
                res.redirect(`/products/${createdProduct.link}`);
                   
                
            }
        });
    });
})
router.get("/:product_id/recipes/add", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            Recipe
                .find({})
                .populate("products")
                .exec((err, recipes) => {
                    if(err){
                        console.log(err)
                    } else {
                        Product.find({products: req.params.product_id}, (err, thisNotAdd) => {
                            if(err){
                                console.log(err)
                            } else {
                                let header = `Zakulinariami | Produkty | ${product.title} | Powiąż z przepisem`;
                                res.render("./products/addRecipe", {thisNotAdd: thisNotAdd,header:header, productSubpage:"",product:product, recipes:recipes, currentUser: req.user})
                            }
                        })
                        
                    }
                })
        }
    })
})


router.post("/:product_id/recipes", isLoggedIn, (req, res) => {
    Product.findById(req.params.product_id, (err, product) => {
        if(err) {
            console.log(err.message)
        } else {
            Recipe
                .findById(req.body.recipe, (err, recipe) => {
                    if(err){
                        console.log(err.message)
                    } else {
                        recipe.products.push(product);
                        recipe.save();
                        product.recipes.push(recipe);
                        product.save();
                        res.redirect(`/products/${product.link}`)
                    }
                })
        }
    })
})

// Product show route

router.get("/:link", (req, res) => {
    Product
        .findOne({link: req.params.link})
        .populate(["whyToEat", "recipes", "pictures"])
        .exec((err, product) => {
            if(err){
                console.log(err);
            } else {
                let header = `Zakulinariami | Produkty | ${product.title}`;
                res.render("./products/show", {header:header, productSubpage:"",product: product, currentUser: req.user});
            }
        })
})
// Product edit page route
router.get("/:id/edit", isLoggedIn, (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if(err){
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Edytuj`;
            res.render("./products/edit", {header:header, productSubpage:"",product: product, currentUser: req.user});
        }
    })
});
// Product edit route
router.put("/:id", isLoggedIn, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body.product, (err, updatedProduct) => {
        if(err) {
            console.log(err)
        } else {
            updatedProduct.link = req.body.product.title.toLowerCase().split(' ').join('-');
            updatedProduct.save();
            res.redirect(`/products/${updatedProduct.link}`);
        }
    })
})


// Product delete route

router.get("/:id/delete", isLoggedIn, (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, updatedProduct) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect(`/products`);
        }
    })
})

router.get("/title/search", function(req, res){
	const regex = new RegExp(escapeRegex(req.query.title), 'gi');
	Product.find({title: regex}, function(err, products){
		if(err){
			console.log(err);
		} else {
            let header = `Zakulinariami | Produkty | Wyszukiwanie po parametrze ${req.query.title}`;
            res.render("./products/search", {header:header, productSubpage:"", products: products, currentUser: req.user, param:req.query.title})
              
			
		}
	});
});

router.get("/:id/edit/profile", isLoggedIn, (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Edytuj zdjęcie główne`;
            res.render("./products/editP", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})

router.get("/:id/add/picture", isLoggedIn, (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if(err) {
            console.log(err)
        } else {
            let header = `Zakulinariami | Produkty | ${product.title} | Dodaj zdjęcie do galerii`;
            res.render("./products/addP", {header:header, productSubpage:"",product: product, currentUser: req.user})
        }
    })
})



router.post("/:id/edit/profile", upload.single("profile"), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Product.findById(req.params.id, (err, product) => {
            if(err) {
                console.log(err)
            } else {
                product.profile = result.secure_url;
                product.save();
                res.redirect(`/products/${product.link}`);
            }
        })
    });
    
})

router.post("/:id/add/picture", upload.single("picture"), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Product.findById(req.params.id, (err, product) => {
            if(err) {
                console.log(err)
            } else {
                Picture.create({source: result.secure_url}, (err, createdPicture) => {
                    if(err){
                        console.log(err)
                    } else {
                        product.pictures.push(createdPicture);
                        product.save();
                        res.redirect(`/products/${product.link}`);
                    }
                   
                })
            }
        })
    });
    
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Prosimy zaloguj się najpierw");
    res.redirect("/");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
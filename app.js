const  express = require("express"),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy,
        Blogger        = require("./models/blogger"),
        aboutRoutes = require("./routes/about"),
        indexRoutes = require("./routes/index"),
        productsRoutes = require("./routes/product"),
        recipesRoutes = require("./routes/recipe"),
        ingredientsRoutes = require("./routes/ingredient"),
        commentsRoutes = require("./routes/comment"),
        whyToEatRoutes = require("./routes/whyToEat"),
        whyToAvoidRoutes = require("./routes/whyToAvoid"),
        substitutesRoutes = require("./routes/substitutes"),
        preparationsRoutes = require("./routes/preparation"),
        decorationsRoutes = require("./routes/decoration"),
        sauceRoutes = require("./routes/sauce"),
        categoryRoutes = require("./routes/category"),
        cheeseRoutes = require("./routes/cheese"),
        methodOverride = require("method-override"),
        flash = require("connect-flash"),
        app = express(),
        dotenv = require("dotenv");
        dotenv.config();
    
  
  
// Database and models
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});


// App configuration

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "heheszki",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.return_route = req.query.return_route;
    res.locals.route = req.path;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Blogger.authenticate()));
passport.serializeUser(Blogger.serializeUser());
passport.deserializeUser(Blogger.deserializeUser());

// Routes
app.use("/about", aboutRoutes);
app.use("/recipes/:recipe_link/comments", commentsRoutes);
app.use("/products", productsRoutes);
app.use("/products/:product_id/whyToEat", whyToEatRoutes);
app.use("/products/:product_id/whyToAvoid", whyToAvoidRoutes);
app.use("/products/:product_id/substitutes", substitutesRoutes);
app.use("/recipes", recipesRoutes);
app.use("/recipes/category", categoryRoutes);
app.use("/recipes/:recipe_id/ingredients", ingredientsRoutes);
app.use("/recipes/:recipe_id/preparations", preparationsRoutes);
app.use("/recipes/:recipe_id/sauce", sauceRoutes);
app.use("/recipes/:recipe_id/decorations", decorationsRoutes);
app.use("/recipes/:recipe_id/cheese", cheeseRoutes);
app.use(indexRoutes)

app.listen(process.env.PORT);
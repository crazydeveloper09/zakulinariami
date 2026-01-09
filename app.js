import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import PassportLocal from "passport-local";
import Blogger from "./models/blogger.js";
import aboutRoutes from "./routes/about.js";
import indexRoutes from "./routes/index.js";
import productsRoutes from "./routes/product.js";
import recipesRoutes from "./routes/recipe.js";
import ingredientsRoutes from "./routes/ingredient.js";
import commentsRoutes from "./routes/comment.js";
import whyToEatRoutes from "./routes/whyToEat.js";
import whyToAvoidRoutes from "./routes/whyToAvoid.js";
import substitutesRoutes from "./routes/substitutes.js";
import preparationsRoutes from "./routes/preparation.js";
import decorationsRoutes from "./routes/decoration.js";
import sauceRoutes from "./routes/sauce.js";
import categoryRoutes from "./routes/category.js";
import cheeseRoutes from "./routes/cheese.js";
import pricesRoutes from "./routes/price.js";
import methodOverride from "method-override";
import flash from "connect-flash";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import expressSession from "express-session";
import helmet from "helmet";
import { hashEmail } from "./helpers.js";

const app = express();
const LocalStrategy = PassportLocal.Strategy;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);


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
app.use(expressSession({
    secret: "heheszki",
    resave: false,
    saveUninitialized: false
}));
app.use(helmet({
    contentSecurityPolicy: false
}))
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
app.use("/products/:product_id/prices", pricesRoutes);
app.use("/recipes", recipesRoutes);
app.use("/recipes/category", categoryRoutes);
app.use("/recipes/:recipe_id/ingredients", ingredientsRoutes);
app.use("/recipes/:recipe_id/preparations", preparationsRoutes);
app.use("/recipes/:recipe_id/sauce", sauceRoutes);
app.use("/recipes/:recipe_id/decorations", decorationsRoutes);
app.use("/recipes/:recipe_id/cheese", cheeseRoutes);
app.use(indexRoutes)

app.listen(process.env.PORT);
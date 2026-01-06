import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import { 
    addSauceIngredient, 
    deleteSauceIngredient, 
    editSauceIngredient, 
    renderNewSauceIngredientForm, 
    renderSauceIngredientEditForm, 
    renderSauceIngredientRedirectPage 
} from "../controllers/sauce.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderSauceIngredientRedirectPage)
router.get("/add", isLoggedIn, renderNewSauceIngredientForm)
router.get("/:sauce_id/edit", isLoggedIn, renderSauceIngredientEditForm);
router.get("/:sauce_id/delete", isLoggedIn, deleteSauceIngredient)

router.post("/", isLoggedIn, addSauceIngredient)

router.put("/:sauce_id", isLoggedIn, editSauceIngredient);

export default router;
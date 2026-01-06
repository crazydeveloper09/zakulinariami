import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import {
    addIngredient,
    deleteIngredient,
    editIngredient,
    renderIngredientEditForm,
    renderIngredientRedirectPage,
    renderNewIngredientForm,
} from "../controllers/ingredient.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({ mergeParams: true });

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderIngredientRedirectPage);
router.get("/add", isLoggedIn, renderNewIngredientForm);
router.get("/:ingredient_id/edit", renderIngredientEditForm);
router.get("/:ingredient_id/delete", isLoggedIn, deleteIngredient);

router.post("/", isLoggedIn, addIngredient);

router.put("/:ingredient_id", isLoggedIn, editIngredient);

export default router;

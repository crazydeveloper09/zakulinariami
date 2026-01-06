import express from "express";
import flash from "connect-flash";
import methodOverride from "method-override";
import { 
    addCheeseIngredient, 
    deleteCheeseIngredient, 
    editCheeseIngredient, 
    renderCheeseIngredientEditForm, 
    renderCheeseIngredientRedirectPage, 
    renderNewCheeseIngredientForm 
} from "../controllers/cheese.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderCheeseIngredientRedirectPage)
router.get("/add", isLoggedIn, renderNewCheeseIngredientForm)
router.get("/:cheese_id/edit", isLoggedIn, renderCheeseIngredientEditForm);
router.get("/:cheese_id/delete", isLoggedIn, deleteCheeseIngredient)

router.post("/", isLoggedIn, addCheeseIngredient)

router.put("/:cheese_id", isLoggedIn, editCheeseIngredient);

export default router;
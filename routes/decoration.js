import express from "express";
import flash from "connect-flash";
import methodOverride from "method-override";
import { 
    editDecorationIngredient, 
    deleteDecorationIngredient, 
    renderDecorationIngredientEditForm, 
    addDecorationIngredient, 
    renderNewDecorationIngredientForm, 
    renderDecorationIngredientRedirectPage 
} from "../controllers/decoration.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderDecorationIngredientRedirectPage)
router.get("/add", isLoggedIn, renderNewDecorationIngredientForm)
router.get("/:decoration_id/edit", isLoggedIn, renderDecorationIngredientEditForm);
router.get("/:decoration_id/delete", isLoggedIn, deleteDecorationIngredient)

router.post("/", isLoggedIn, addDecorationIngredient)

router.put("/:decoration_id", isLoggedIn, editDecorationIngredient);

export default router;
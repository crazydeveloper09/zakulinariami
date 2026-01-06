import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash"
import { 
    addCategory, 
    deleteCategory, 
    editCategory, 
    renderCategoryEditForm, 
    renderCategoryPage, 
    renderNewCategoryForm, 
    searchCategory 
} from "../controllers/category.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/new", isLoggedIn, renderNewCategoryForm)
router.get("/:category_link", renderCategoryPage);
router.get("/:category_id/edit", isLoggedIn, renderCategoryEditForm);
router.get("/:category_id/delete", isLoggedIn, deleteCategory)
router.get("/:category_link/search", searchCategory);

router.post("/", isLoggedIn, addCategory)

router.put("/:category_id", isLoggedIn, editCategory);

export default router;
import express from "express";
import { 
    addCategoryToRecipe,
    addPhotoToRecipeGallery, 
    addRecipe, 
    deleteRecipe, 
    editRecipe, 
    editRecipeProfilePicture, 
    linkProductToRecipe, 
    publishRecipe, 
    renderAddPhotoToRecipeGallery, 
    renderEditRecipeForm, 
    renderEditRecipeProfilePicture, 
    renderLinkRecipeProductForm, 
    renderNewRecipeForm, 
    renderRecipeCategoryLinkForm, 
    renderRecipeMainPage, 
    renderRecipeShowPage, 
    reportRecipe, 
    searchRecipes, 
    searchRecipesAdvanced 
} from "../controllers/recipe.js";
import { isLoggedIn, upload } from "../helpers.js";
import flash from "connect-flash";
import methodOverride from "method-override";

const app = express();
const router = express.Router();

app.use(flash());
app.use(methodOverride("_method"))

router.get("/advanced/search", searchRecipesAdvanced);
router.get("/title/search", searchRecipes);
router.get("/", renderRecipeMainPage);
router.get("/new", isLoggedIn, renderNewRecipeForm);
router.get("/:recipe_id", renderRecipeShowPage);
router.get("/:recipe_id/edit/profile", isLoggedIn, renderEditRecipeProfilePicture)
router.get("/:recipe_id/add/picture", isLoggedIn, renderAddPhotoToRecipeGallery)
router.get("/:recipe_id/edit", isLoggedIn, renderEditRecipeForm);
router.get("/:recipe_id/delete", isLoggedIn, deleteRecipe);
router.get("/:recipe_id/publish", isLoggedIn, publishRecipe);
router.get("/:recipe_id/categories/add", isLoggedIn, renderRecipeCategoryLinkForm)
router.get("/:recipe_id/products/add", isLoggedIn, renderLinkRecipeProductForm)

router.post("/:recipe_id/products", isLoggedIn, linkProductToRecipe)
router.post("/:recipe_id/categories", isLoggedIn, addCategoryToRecipe)
router.post("/:recipe_id/report", reportRecipe)
router.post("/",  upload.single("profile"), addRecipe);
router.post("/:recipe_id/edit/profile", upload.single("profile"), editRecipeProfilePicture)
router.post("/:recipe_id/add/picture", upload.single("picture"), addPhotoToRecipeGallery)

router.put("/:recipe_id", isLoggedIn, editRecipe);

export default router;
import express from "express";
import { 
    addPhotoToProductGallery, 
    createProduct, 
    deleteProduct, 
    editProduct, 
    editProductProfilePicture, 
    linkProductToRecipe, 
    publishProduct, 
    renderAddPhotoToProductGallery, 
    renderEditProductForm, 
    renderEditProductProfilePicture, 
    renderLinkProductRecipeForm, 
    renderNewProductForm, 
    renderProductMainPage, 
    renderProductShowPage, 
    reportProduct, 
    searchProducts 
} from "../controllers/product.js";
import { isLoggedIn, upload } from "../helpers.js";
import flash from "connect-flash";
import methodOverride from "method-override";

const app = express();
const router = express.Router();

app.use(flash());
app.use(methodOverride("_method"));

router.get("/", renderProductMainPage)
router.get("/new", isLoggedIn, renderNewProductForm)
router.get("/:product_id/recipes/add", isLoggedIn, renderLinkProductRecipeForm)
router.get("/:link", renderProductShowPage)
router.get("/:product_id/edit", isLoggedIn, renderEditProductForm);
router.get("/:product_id/delete", isLoggedIn, deleteProduct)
router.get("/:product_id/publish", isLoggedIn, publishProduct)
router.get("/title/search", searchProducts);
router.get("/:product_id/edit/profile", isLoggedIn, renderEditProductProfilePicture)
router.get("/:product_id/add/picture", isLoggedIn, renderAddPhotoToProductGallery)

router.post("/", upload.single("profile"), createProduct)
router.post("/:product_id/recipes", isLoggedIn, linkProductToRecipe)
router.post("/:product_id/report", reportProduct)
router.post("/:product_id/edit/profile", upload.single("profile"), editProductProfilePicture)
router.post("/:product_id/add/picture", upload.single("picture"), addPhotoToProductGallery)

router.put("/:product_id", isLoggedIn, editProduct)

export default router;
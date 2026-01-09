import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import { 
    addPrice, 
    deletePrice, 
    editPrice, 
    renderNewPriceForm, 
    renderPriceEditForm, 
    renderPriceRedirectPage 
} from "../controllers/price.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderPriceRedirectPage);
router.get("/new", isLoggedIn, renderNewPriceForm);
router.get("/:price_id/edit", isLoggedIn, renderPriceEditForm);
router.get("/:price_id/delete", isLoggedIn, deletePrice);

router.post("/", isLoggedIn, addPrice)

router.put("/:price_id", isLoggedIn, editPrice);

export default router;
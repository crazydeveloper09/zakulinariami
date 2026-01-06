import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import { 
    addWhyToEat, 
    deleteWhyToEat, 
    editWhyToEat,
    renderNewWhyToEatForm, 
    renderWhyToEatEditForm, 
    renderWhyToEatRedirectPage 
} from "../controllers/whyToEat.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderWhyToEatRedirectPage);
router.get("/new", isLoggedIn, renderNewWhyToEatForm);
router.get("/:whyToEat_id/edit", isLoggedIn, renderWhyToEatEditForm);
router.get("/:whyToEat_id/delete", isLoggedIn, deleteWhyToEat);

router.post("/", isLoggedIn, addWhyToEat)

router.put("/:whyToEat_id", isLoggedIn, editWhyToEat);

export default router;
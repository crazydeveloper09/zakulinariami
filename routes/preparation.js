import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import { 
    addPreparation, 
    deletePreparation, 
    editPreparation, 
    renderNewPreparationForm, 
    renderPreparationEditForm, 
    renderPreparationRedirectPage 
} from "../controllers/preparation.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderPreparationRedirectPage)

router.get("/add", isLoggedIn, renderNewPreparationForm)

router.post("/", isLoggedIn, addPreparation)

router.get("/:preparation_id/edit", renderPreparationEditForm);

router.put("/:preparation_id", isLoggedIn, editPreparation);

router.get("/:preparation_id/delete", isLoggedIn, deletePreparation)

export default router;
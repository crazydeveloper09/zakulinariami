import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import { 
    addSubstitute, 
    deleteSubstitute, 
    editSubstitute, 
    renderNewSubstituteForm, 
    renderSubstituteEditForm, 
    renderSubstituteRedirectPage 
} from "../controllers/substitutes.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderSubstituteRedirectPage)
router.get("/new", isLoggedIn, renderNewSubstituteForm)
router.get("/:substitute_id/edit", isLoggedIn, renderSubstituteEditForm);
router.get("/:substitute_id/delete", isLoggedIn, deleteSubstitute)

router.post("/", isLoggedIn, addSubstitute)

router.put("/:substitute_id", isLoggedIn, editSubstitute);

export default router;
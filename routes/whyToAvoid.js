import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import { 
    addWhyToAvoid, 
    deleteWhyToAvoid, 
    editWhyToAvoid, 
    renderNewWhyToAvoidForm, 
    renderWhyToAvoidEditForm, 
    renderWhyToAvoidRedirectPage 
} from "../controllers/whyToAvoid.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderWhyToAvoidRedirectPage);
router.get("/new", isLoggedIn, renderNewWhyToAvoidForm);
router.get("/:whyToAvoid_id/edit", isLoggedIn, renderWhyToAvoidEditForm);
router.get("/:whyToAvoid_id/delete", isLoggedIn, deleteWhyToAvoid);

router.post("/", isLoggedIn, addWhyToAvoid)

router.put("/:whyToAvoid_id", isLoggedIn, editWhyToAvoid);

export default router;
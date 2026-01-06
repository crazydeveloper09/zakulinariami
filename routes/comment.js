import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash"
import { 
    addAnswer, 
    renderAnswersPage, 
    renderNewAnswerForm, 
    editComment, 
    deleteComment, 
    renderEditCommentForm, 
    addComment, 
    renderNewCommentForm 
} from "../controllers/comment.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({mergeParams: true});

app.use(flash());
app.use(methodOverride("_method"))

router.get("/new", renderNewCommentForm)
router.get("/:id/edit", isLoggedIn, renderEditCommentForm);
router.get("/:id/delete", isLoggedIn, deleteComment);
router.get("/:comment_id/answers/new", renderNewAnswerForm);
router.get("/:comment_id/answers", renderAnswersPage)

router.post("/", addComment);
router.post("/:comment_id/answers", addAnswer);

router.put("/:id", isLoggedIn, editComment);

export default router;
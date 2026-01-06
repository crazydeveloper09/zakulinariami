import express from "express"
import { 
    editBlogger, 
    editBloggerProfilePicture, 
    findBlogger, 
    renderEditBloggerForm, 
    renderEditBloggerProfilePicture, 
    renderVerificationForm, 
    verifyBlogger 
} from "../controllers/about.js";
import { isLoggedIn, upload } from "../helpers.js";

const router = express.Router();

router.get("/:username", findBlogger);
router.get("/:blogger_id/edit", isLoggedIn, renderEditBloggerForm);
router.get("/:blogger_id/verification", renderVerificationForm);
router.get("/:blogger_id/edit/profile", isLoggedIn, renderEditBloggerProfilePicture)

router.post("/:blogger_id/verification", verifyBlogger)
router.post("/:blogger_id/edit/profile", upload.single("profile"), editBloggerProfilePicture)

router.put("/:blogger_id", isLoggedIn, editBlogger);


export default router;
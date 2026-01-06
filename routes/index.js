import express from "express";
import {
    encryptData,
    logInUser,
    logOutUser,
    registerUser,
    renderForgotPasswordPage,
    renderHomePage,
    renderLandingPage,
    renderLoginPage,
    renderPrivacyPolicyPage,
    renderRegisterPage,
    renderResetPasswordPage,
    resetPassword,
    sendForgotPasswordEmail,
} from "../controllers/index.js";
import flash from "connect-flash";
import { upload } from "../helpers.js";

const app = express();
const router = express.Router();

app.use(flash());

router.get("/", renderLandingPage);
router.get("/home", renderHomePage);
router.get("/login", renderLoginPage);
router.get("/register", renderRegisterPage);
router.get("/forgot", renderForgotPasswordPage);
router.get("/policy", renderPrivacyPolicyPage)
router.get("/reset/:token", renderResetPasswordPage);
router.get("/logout", logOutUser);
router.get("/encrypt-data", encryptData)

router.post("/forgot", sendForgotPasswordEmail);
router.post("/reset/:token", resetPassword);
router.post("/login", logInUser);
router.post("/register", upload.single("profile"), registerUser);

export default router;

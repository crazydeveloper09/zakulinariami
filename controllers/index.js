import Blogger from "../models/blogger.js";
import Recipe from "../models/recipe.js";
import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { decrypt, encrypt, hashEmail, sendSimpleMessage } from "../helpers.js";
import passport from "passport";
import { resetPasswordLinkTemplate } from "../emails/templates/resetPassword.js";
import { passwordChangedTemplate } from "../emails/templates/confirmPasswordChange.js";
import { verifyCodeTemplate } from "../emails/templates/verifyAccount.js";

dotenv.config()


cloudinary.config({ 
  cloud_name: 'syberiancats', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const renderLandingPage = (req, res, next) => {
    let header = `Cookiety | Przywitanie`;
    res.render("landing", {header:header});
}

export const renderHomePage = (req, res, next) => {
    Recipe
        .find({ published: true })
        .populate(["comments", "ingredients"])
        .exec()
        .then((recipes) => {
            let header = `Cookiety | Strona Główna`;
            res.render("index", {
                header,
                home:"",
                currentUser: req.user, 
                recipes
            });
        })
        .catch((err) => console.log(err))
}

export const renderLoginPage = (req, res, next) => {
    let header = `Cookiety | Logowanie`;
    res.render("login", {
        header:header, 
        route: req.query.return_route
    });
}

export const renderRegisterPage = (req, res, next) => {
    let header = `Cookiety | Rejestracja`;
    res.render("register", { header: header, route: req.query.return_route })
}

export const renderPrivacyPolicyPage = (req, res, next) => {
    let header = `Cookiety | Polityka prywatności`;
    res.render("policy", { header:header })
}

export const renderForgotPasswordPage = (req, res, next) => {
    let header = `Cookiety | Zapomniałem hasło`;
    res.render("forgot", { header:header });
}

export const sendForgotPasswordEmail = (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){
            const hashedEmail = hashEmail(req.body.email);
            Blogger.findOne({ hashedEmail }, function(err, user){
                if(!user){
                    req.flash('error', 'Nie znaleźliśmy konta z takim emailem. Spróbuj ponownie');
                    return res.redirect("/forgot");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 360000;
                user.save(function(err){
                    done(err, token, user, req.body.email);
                });
            });
        },
        function(token, user, mail, done) {
            const subject = "Resetowanie hasła w społeczności Cookiety";
            const resetUrl = `https://${req.headers.host}/reset/${token}`;
            sendSimpleMessage(mail, subject, resetPasswordLinkTemplate, { resetUrl })
         
            req.flash("success", "Email został wysłany na adres " + mail + " z dalszymi instrukcjami");
            done(undefined, 'done')
           
        }
    ], function(err){
        if(err) return next(err);
        res.redirect('/forgot');
    });
}

export const renderResetPasswordPage = (req, res, next) => {
    Blogger
        .findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }})
        .exec()
        .then((user) => {
            if(!user) {
                req.flash("error", "Token wygasł lub jest niepoprawny");
                return res.redirect("/forgot");
            }
            let header = `Cookiety | Resetowanie hasła`;
            res.render("reset", {
                header, 
                token: req.params.token 
            });

        })
        .catch((err) => console.log(err))
}

export const resetPassword = (req, res, next) => {
    async.waterfall([
        function(done) {
            Blogger
                .findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
                .exec()
                .then((user) => {
                    if(!user){
                        req.flash("error", "Token wygasł lub jest niepoprawny");
                        return res.redirect("back");
                    }
                    if(req.body.password === req.body.confirm){
                        user.setPassword(req.body.password, function(err){
                            user.resetPasswordExpires = undefined;
                            user.resetPasswordToken = undefined;
                            user.save(function(err){
                                req.logIn(user, function(err){
                                    done(err, user);
                                });
                            });
                        });
                    } else {
                        req.flash("error", "Hasła nie pasują do siebie");
                        return res.redirect("back");
                    }
                })
                .catch((err) => console.log(err))
        },
        function(user, done){
        
            const subject = "Potwierdzenie zmiany hasła na blogu Cookiety";
            sendSimpleMessage(decrypt(user.email), subject, passwordChangedTemplate, {})
            
            req.flash("success", "Twoje hasło zostało zmienione pomyślnie");
            done(undefined);
        }
    ], function(err){
        res.redirect("/login");
    });
}

export const logOutUser = (req, res, next) => {
    req.logout();
    res.redirect("/home");
}

export const logInUser = (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash("error", "Zła nazwa użytkownika lub hasło");
            return res.redirect(`/login`);
        }
        if(user.verificated){
            req.logIn(user, async function (err) {
                if (err) { return next(err); }
                return res.redirect(req.query.return_route);
            });
        } else {
            res.redirect(`/about/${user._id}/verification?return_route=${req.query.return_route}`)
        }
      
    })(req, res, next);
}

export const registerUser = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        let verificationCode = '';
        for (let i = 0; i <= 5; i++) {
            let number = Math.floor(Math.random() * 10);
            let numberString = number.toString();
            verificationCode += numberString;
        }
        let emailHash = hashEmail(req.body.email);
        let newBlogger = new Blogger({
            username: req.body.username,
            email: req.body.email,
            profile: result.secure_url,
            hashedEmail: emailHash,
            verificationCode,
            verificationExpires: Date.now() + 360000,
            age:"",
            city:"",
            description:"",
            hobbies:""
        });
        Blogger.register(newBlogger, req.body.password, function(err, user) {
            if(err) {    
                return res.render("register");
            } 
            passport.authenticate("local")(req, res, function() {
                const subject = "Zweryfikuj konto w Cookiety";
                sendSimpleMessage(user.email, subject, verifyCodeTemplate, { code: user.verificationCode })
                res.redirect(`/about/${user._id}/verification?return_route=${req.query.return_route}`);
            });
        });
    });
}

export const encryptData = (req, res, next) => {
    Blogger
        .findOne({ username: "Admin"})
        .exec()
        .then((blogger) => {
            blogger.name = encrypt(blogger.name)
            blogger.surname = encrypt(blogger.surname)
            blogger.email = encrypt(blogger.email)
            blogger.description = encrypt(blogger.description)
            blogger.hobbies = encrypt(blogger.hobbies)
            blogger.save();
            res.redirect("done")
        })
        .catch((err) => console.log(err))
}
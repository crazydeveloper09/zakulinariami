import { resendCodeTemplate } from "../emails/templates/resendCode.js";
import { decrypt, sendSimpleMessage } from "../helpers.js";
import Blogger from "../models/blogger.js";
import Recipe from "../models/recipe.js";

export const findBlogger = (req, res, next) => {
    Blogger
        .findOne({username: req.params.username})
        .exec()
        .then((user) => {
            const isAuthor = req.user?.username === req.params.username ? {}: { published: true };
            Recipe
                .find({ $and: [{ author: user._id }, isAuthor] })
                .exec()
                .then((recipes) => {
                    let header = `Cookiety | Profil użytkownika ${user.username}`;
                    res.render("./profiles/show", {
                        header, 
                        recipes,
                        about:"", 
                        currentUser: req.user, 
                        thisUser: user 
                    });
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

export const renderEditBloggerForm = (req, res, next) => {
    Blogger
        .findById(req.params.blogger_id)
        .exec()
        .then((user) => {
            let header = `Cookiety | Profil użytkownika | ${user.username} | Edytuj`;
            res.render("./profiles/edit", {
                header, 
                about:"", 
                currentUser: req.user, 
                user
            });
        })
        .catch((err) => console.log(err));
}

export const editBlogger = (req, res, next) => {
    Blogger
        .findByIdAndUpdate(req.params.blogger_id, req.body.blogger)
        .exec()
        .then((updatedUser) => res.redirect(`/about/${updatedUser.username}`))
        .catch((err) => console.log(err))
}

export const renderEditBloggerProfilePicture = (req, res, next) => {
    Blogger
        .findById(req.params.blogger_id)
        .exec()
        .then((blogger) => {
            let header = `Cookiety | Profil | ${blogger.username} | Edytuj zdjęcie profilowe`;
            res.render("./profiles/editP", {
                header, 
                about:"",
                blogger, 
                currentUser: req.user
            })
        })
        .catch((err) => console.log(err))
}

export const editBloggerProfilePicture = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        Blogger
        .findById(req.params.blogger_id)
        .exec()
        .then((blogger) => {
            blogger.profile = result.secure_url;
            blogger.save();
            res.redirect(`/about/${blogger.username}`);
        })
        .catch((err) => console.log(err))
    });
}

export const renderVerificationForm = (req, res, next) => {
    Blogger
        .findOne({
            $and: [
                {_id: req.params.blogger_id},
                {verificationExpires: { $gt: Date.now()}}
            ]
        })
        .exec()
        .then((blogger) => {
            if(blogger){
                let header = "Weryfikacja konta | Cookiety"
                res.render("./verification", {
                    header: header,
                    blogger_id: req.params.blogger_id,
                    return_route: req.query.return_route
                })
            } else {
                req.flash("error", "Kod weryfikacyjny wygasł lub nie ma takiego konta. Kliknij przycisk Wyślij kod ponownie poniżej ")
                let header = "Weryfikacja konta | Cookiety"
                res.render("./verification", {
                    header: header,
                    blogger_id: req.params.blogger_id,
                    return_route: req.query.return_route
                })
            }
        })
        .catch((err) => console.log(err))
}

export const verifyBlogger = (req, res, next) => {
    if(req.body.action === "verify") {
        Blogger
            .findOne({
                $and: [
                    {_id: req.params.blogger_id},
                    {verificationExpires: { $gt: Date.now()}},
                ]
            })
            .exec()
            .then((blogger) => {
                if(blogger){
                    if(blogger.verificationCode === +req.body.code){
                        blogger.verificated = true;
                        blogger.save();
                        req.flash("success", `Witaj ${blogger.username}. Bardzo nam miło, że do nas dołączyłeś`)
                        res.redirect(`/login?return_route=${req.query.return_route}`)
                    } else {
                        req.flash("error", "Kod weryfikacyjny jest niepoprawny. Spróbuj ponownie")
                        res.redirect(`back`)
                    }
                } else {
                    req.flash("error", "Kod weryfikacyjny wygasł lub nie ma takiego konta. Kliknij przycisk Wyślij kod ponownie poniżej ")
                    res.redirect("back")
                }
            })
            .catch((err) => console.log(err))
    }

    if(req.body.action === "resend") {
        Blogger
            .findById(req.params.blogger_id)
            .exec()
            .then((blogger) => {
                let verificationCode = '';
                for (let i = 0; i <= 5; i++) {
                    let number = Math.floor(Math.random() * 10);
                    let numberString = number.toString();
                    verificationCode += numberString;
                }
                blogger.verificationCode = verificationCode;
                blogger.verificationExpires = Date.now() + 360000;
                blogger.save()
                const subject = 'Ponowne wysłanie kodu, by potwierdzić email'; 
                sendSimpleMessage(decrypt(blogger.email), subject, resendCodeTemplate, { code: blogger.verificationCode })
                res.redirect(`/about/${blogger._id}/verification?return_route=${req.query.return_route}`);
            })
            .catch((err) => console.log(err))
    }
}
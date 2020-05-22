const express = require("express"),
    Blogger = require("../models/blogger"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router();
app.use(flash());

router.get("/", function (req, res) {
    let username = "crazyadmin";
    Blogger.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            let header = `Zakulinariami | O mnie`;
            res.render("./profiles/show", {header:header, about:"", currentUser: req.user, thisUser: user });
        }
    });
});

router.get("/:id/edit", isLoggedIn, function (req, res) {
    Blogger.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            let header = `Zakulinariami | O mnie | ${user.username} | Edytuj`;
            res.render("./profiles/edit", {header:header, about:"", currentUser: req.user, user: user });
        }
    });
});


router.put("/:id", isLoggedIn, function (req, res) {
    Blogger.findByIdAndUpdate(req.params.id, req.body.blogger, function (err, user) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/about");
        }
    });
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Prosimy zaloguj się najpierw");
    res.redirect("/");
}
module.exports = router;
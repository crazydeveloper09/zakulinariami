const express = require("express"),
    Blogger = require("../models/blogger"),
    Recipe = require("../models/recipe"),
    passport = require("passport"),
    async = require("async"),
    crypto = require("crypto"),
    nodemailer = require("nodemailer"),
    xoauth2 = require("xoauth2"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router(),
    multer = require("multer"),
    dotenv = require("dotenv");
    dotenv.config();

var storage = multer.diskStorage({
filename: function(req, file, callback) {
callback(null, Date.now() + file.originalname);
}
});
var imageFilter = function (req, file, cb) {
// accept image files only
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
}
cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'syberiancats', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(flash());


router.get("/", function(req, res){
    Recipe.find({}).populate("comments").exec(function(err, recipes){
        if(err){
            console.log(err);
        } else {
            let header = `Zakulinariami | Strona Główna`;
            res.render("index", {header:header,home:"",currentUser: req.user, recipes:recipes});
        }
    });
  
});

router.get("/login", function(req, res){
    let header = `Zakulinariami | Logowanie`;
    res.render("login",{header:header,});
});

router.get("/register", function(req, res){
    let header = `Zakulinariami | Rejestracja`;
    res.render("register", {header:header,})
});

router.get("/forgot", function(req, res){
    let header = `Zakulinariami | Zapomniałem hasło`;
    res.render("forgot", {header:header,});
});

router.post("/forgot", function(req, res, next){
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){
            Blogger.findOne({ email: req.body.email }, function(err, user){
                if(!user){
                    req.flash('error', 'Nie znaleźliśmy konta z takim emailem. Spróbuj ponownie');
                    return res.redirect("/forgot");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 360000;
                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: 
                    {
                        type: "OAuth2",
                        user: 'zakulinariami@gmail.com',
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN 
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'Zakulinariami - blog kulinarny <zakulinariami@gmail.com>',
                subject: "Resetowanie hasła na blogu Zakulinariami",
                text: 'Otrzymujesz ten email, ponieważ ty (albo ktoś inny) zażądał zmianę hasła na blogu Zakulinariami. \n\n' + 
                    'Prosimy kliknij w poniższy link albo skopiuj go do paska przeglądarki, by dokończyć ten proces: \n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' + 
                    'Jeśli to nie ty zażądałeś zmiany, prosimy zignoruj ten email, a twoje hasło nie zostanie zmienione. \n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash("success", "Email został wysłany na adres " + user.email + " z dalszymi instrukcjami");
                done(err, 'done');
            });
        }
    ], function(err){
        if(err) return next(err);
        res.redirect('/forgot');
    });
});

router.get("/reset/:token", function(req, res){
    Blogger.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user){
        if(!user) {
            req.flash("error", "Token wygasł lub jest niepoprawny");
            return res.redirect("/forgot");
        }
        let header = `Zakulinariami | Resetowanie hasła`;
        res.render("reset", {header:header, token: req.params.token });
    });
});

router.post("/reset/:token", function(req, res){
    async.waterfall([
        function(done) {
            Blogger.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
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
            });
        },
        function(user, done){
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: "OAuth2",
                    user: 'zakulinariami@gmail.com',
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'Zakulinariami - blog kulinarny <zakulinariami@gmail.com>',
                subject: "Potwierdzenie zmiany hasła na blogu Zakulinariami",
                text: 'Witaj ' + user.username + ', \n\n' + 
                'To jest potwierdzenie, że twoje hasło zostało właśnie zmienione'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash("success", "Twoje hasło zostało zmienione pomyślnie");
                done(err);
            });
        }
    ], function(err){
        res.redirect("/");
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {

});
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.post("/register", upload.single("profile"), function(req, res){
    
    cloudinary.uploader.upload(req.file.path, function(result) {
        let newBlogger = new Blogger({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            profile: result.secure_url,
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
                
                res.redirect("/");
            });
        });
    });
   
});

module.exports = router
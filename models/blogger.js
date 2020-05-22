const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


const bloggerSchema = new mongoose.Schema({
    username: { 
        type:String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile: String,
    password: String,
    hobbies: String,
    age: Number,
    city: String,
    description: String,
    joined: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
bloggerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Blogger", bloggerSchema);
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { decrypt, encrypt } from "../helpers.js";


const bloggerSchema = new mongoose.Schema({
    username: { 
        type:String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
       
    },
    surname: {
        type: String,
        required: true,
        
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
       
    },
    hashedEmail: String,
    profile: String,
    password: String,
    hobbies: {
        type: String,
        
    },
    age: Number,
    city: String,
    description: {
        type: String,
        
    },
    joined: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationCode: Number, 
    verificationExpires: Date,
    verificated: {
        type: Boolean,
        default: false
    }
});
bloggerSchema.plugin(passportLocalMongoose);

export default mongoose.model("Blogger", bloggerSchema);
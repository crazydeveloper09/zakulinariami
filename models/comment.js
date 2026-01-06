import mongoose from "mongoose";
import { decrypt, encrypt } from "../helpers.js";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogger'
    },
    text: {
        type: String,
        set: (text) => encrypt(text),
        get: (encryptedText) => decrypt(encryptedText),
    },
    nickname: {
        type: String,
        set: (nickname) => encrypt(nickname),
        get: (encryptedNickname) => decrypt(encryptedNickname),
    },
    written: {
        type: Date,
        default: Date.now()
    },
    recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
    },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'
        }
    ],
});

export default mongoose.model("Comment", commentSchema);
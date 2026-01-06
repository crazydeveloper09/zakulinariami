import mongoose from "mongoose";
import { decrypt, encrypt } from "../helpers.js";

const answerSchema = new mongoose.Schema({
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
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
})


export default mongoose.model("Answer", answerSchema);
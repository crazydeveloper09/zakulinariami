const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogger'
    },
    text: String,
    nickname: String,
    written: {
        type: Date,
        default: Date.now()
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
})


module.exports = mongoose.model("Answer", answerSchema);
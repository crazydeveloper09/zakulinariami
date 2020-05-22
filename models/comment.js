const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    author: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blogger'
        }
    ],
    text: String,
    nickname: String,
    written: {
        type: Date,
        default: Date.now()
    },
    recipe: 
        {
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

module.exports = mongoose.model("Comment", commentSchema);
const mongoose = require("mongoose");
    


const recipeSchema = new mongoose.Schema({
    title: String,
    author: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blogger'
        }
    ],
    description: String,
    profile: String,
    pictures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        }
    ],
    link: String,
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            unique: true
        }
    ],
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ingredient"
        }
    ],
    preparations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Preparation"
        }
    ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    written : {
        type: Date,
        default: Date.now()
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    hours: Number,
    minutes: Number,
    plates: Number
});

module.exports = mongoose.model('Recipe', recipeSchema);
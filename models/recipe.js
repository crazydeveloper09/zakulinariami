import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: String,
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blogger'
    },
    description: String,
    profile: String,
    level: String,
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
            ref: "Category"
        }
    ],
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ingredient"
        }
    ],
    cheese: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cheese"
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
    sauce: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sauce"
        }
    ],
    decorations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Decoration"
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
    plates: Number,
    published: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Recipe', recipeSchema);
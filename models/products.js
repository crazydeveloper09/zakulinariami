const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    link: String,
    description: String,
    profile: String,
    pictures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        }
    ],
    whyToEat: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WhyToEat"
        }
    ],
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe"
        }
    ],
    isInRecipe: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Product", productSchema);
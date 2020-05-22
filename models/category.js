const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: String,
    link: String,
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            unique: true
        }
    ],
    isInRecipe: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Category", categorySchema);
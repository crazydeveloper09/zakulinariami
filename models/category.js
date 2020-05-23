const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: String,
    link: String,
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe"
        }
    ]
})

module.exports = mongoose.model("Category", categorySchema);
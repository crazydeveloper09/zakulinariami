const mongoose = require("mongoose");


const ingredientSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Ingredient", ingredientSchema);
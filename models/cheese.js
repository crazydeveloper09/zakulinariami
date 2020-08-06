const mongoose = require("mongoose");

const cheeseSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Cheese", cheeseSchema);
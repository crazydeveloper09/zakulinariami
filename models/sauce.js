const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Sauce", sauceSchema);
const mongoose = require("mongoose");

const preparationSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Preparation", preparationSchema);
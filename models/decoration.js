const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Decoration", decorationSchema);
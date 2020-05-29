const mongoose = require("mongoose");

const substituteSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("Substitute", substituteSchema);
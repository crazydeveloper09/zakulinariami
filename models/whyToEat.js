const mongoose = require("mongoose");

const whyToEatSchema = new mongoose.Schema({
    text: String
})

module.exports = mongoose.model("WhyToEat", whyToEatSchema);
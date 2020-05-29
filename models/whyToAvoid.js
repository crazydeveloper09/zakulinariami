const mongoose = require("mongoose");

const whyToAvoidSchema = new mongoose.Schema({
    text: String
});

module.exports=mongoose.model("WhyToAvoid", whyToAvoidSchema);
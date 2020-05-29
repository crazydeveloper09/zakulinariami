const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    link: String,
    description: String,
    profile: String,
    pictures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        }
    ],
    whyToEat: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WhyToEat"
        }
    ],
	whyToAvoid: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WhyToAvoid"
        }
    ],
	substitutes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Substitute"
        }
    ],
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe"
        }
    ]
})

module.exports = mongoose.model("Product", productSchema);
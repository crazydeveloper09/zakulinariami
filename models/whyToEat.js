import mongoose from "mongoose";

const whyToEatSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("WhyToEat", whyToEatSchema);
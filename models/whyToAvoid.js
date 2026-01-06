import mongoose from "mongoose";

const whyToAvoidSchema = new mongoose.Schema({
    text: String
});

export default mongoose.model("WhyToAvoid", whyToAvoidSchema);
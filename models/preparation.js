import mongoose from "mongoose";

const preparationSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("Preparation", preparationSchema);
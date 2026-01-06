import mongoose from "mongoose";

const decorationSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("Decoration", decorationSchema);
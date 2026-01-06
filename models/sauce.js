import mongoose from "mongoose";

const sauceSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("Sauce", sauceSchema);
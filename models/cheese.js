import mongoose from "mongoose";

const cheeseSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("Cheese", cheeseSchema);
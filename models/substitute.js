import mongoose from "mongoose";

const substituteSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("Substitute", substituteSchema);
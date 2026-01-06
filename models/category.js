import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String,
    link: String,
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe"
        }
    ]
})

export default mongoose.model("Category", categorySchema);
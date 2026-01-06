import mongoose from "mongoose";


const ingredientSchema = new mongoose.Schema({
    text: String
})

export default mongoose.model("Ingredient", ingredientSchema);
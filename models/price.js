import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    shopName: String,
    amount: Number
})

export default mongoose.model("Price", priceSchema);
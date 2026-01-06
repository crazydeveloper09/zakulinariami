import mongoose from "mongoose"

const pictureSchema = mongoose.Schema({
    source: String
})


export default mongoose.model("Picture", pictureSchema)
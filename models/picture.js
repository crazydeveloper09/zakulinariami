const mongoose = require("mongoose");

const pictureSchema = mongoose.Schema({
    source: String
})


module.exports = mongoose.model("Picture", pictureSchema)
const mongoose = require("mongoose");

const ImgSchema = new mongoose.Schema({
    imgName: {
        type: String,
    },
    base64Data: {
        type: String,
        required: true,
    }
},{timestamps: true})

module.exports = mongoose.model("Img",ImgSchema);
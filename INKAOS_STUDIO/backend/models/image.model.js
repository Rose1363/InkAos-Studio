import mongoose from "mongoose";

const imageScheme = new mongoose.Schema({
    image : {
        type : String,
        default : ""
    },
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps : true
})

const ImageModel = new mongoose.model("Image",imageScheme)
export default ImageModel
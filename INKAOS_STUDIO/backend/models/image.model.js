import mongoose from "mongoose";

const imageScheme = new mongoose.Schema({
    image : {
        type : String,
        default : ""
    },
    
    
}, {
    timestamps : true
})

const ImageModel = new mongoose.model("Image",imageScheme)
export default ImageModel
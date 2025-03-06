import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address : {
        type : String
    }
},{
    timestamps : true
})

const AddressModel = mongoose.model("address", addressSchema)

export default AddressModel
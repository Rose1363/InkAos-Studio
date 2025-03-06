import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, "provide name"]
    },

   

    email: {
        type: String,
        required: [true, "provide email"],  
        unique: true
    },
    password: {
    type: String,
    required: [true, "provide password"], 
    },
      
    avatar : {
        type : String,
        default : ""
    },
    mobile : {
        type : Number,
        default : null
    },
    refresh_token : {
        type : String,
        default : ""
    },
    verify_email : {
        type : Boolean,
        default : false
    },
    last_login_date : {
        type : Date,
        default : null
    },
    status : {
        type : String,
        enum : ["Active", "Inactive", "Suspended"],
        default : "Active"
    },
    address_details : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'address'
        }
    ],


    forgot_password_otp : {
        type : String,
        default : null
    },
    forgot_password_exp : {
        type : Date,
        default : null
    },
    role : {
        type : String,
        enum : ["Admin", "User"],
        default : "User"
    },

   
}, {
    timestamps : true
})

const UserModel = mongoose.model("User", userSchema)

export default UserModel
import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOpt from "../utils/generateOpt.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken"
export async function registerUserController(request, response){
    try {
        const { name, email, password } = request.body

        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide name, email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(user){
            return response.json({
                message : "Already register email",
                error : true,
                success : false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const payload = {
            name,
            email,
            password : hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`
        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify mail from InkAos Studio",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })
        })

        return response.json({
            message : "User register successfully",
            error : false,
            success: true,
            data: save
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export async function verifyEmailController(request, response) {
    try {
        const {code} = request.body
        const user = await UserModel.findOne( {_id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({_id : code}, {
            verify_email : true
        })

        return response.json({
            message : "Verify mail done",
            error : false,
            success : true
        })
            
        
        
    } catch (error) {
        return response.status(500).json({
            message : error.message ||error,
            error : true,
            success : false
        })
    }
    
}

//login controller
export async function loginController(request, response) {
    try {
        const { email, password } = request.body

        if(!email || !password){
            return response.status(400).json({
                message : "Provode email, password",
                error : true,
                success : false
            })
        }
        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "User not register yet",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            return response.status(400).json({
                message : "Password incorrect",
                error : true,
                success : false
            })
        }

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date(),
        })
        const cookieOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken', accessToken, cookieOption)
        response.cookie('refreshToken', refreshToken, cookieOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//logout
export async function logoutController(request, response) {
    try {
        const userid = request.userId;

        const cookieOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.clearCookie("accessToken", cookieOption);
        response.clearCookie("refreshToken", cookieOption);


        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Log out successfully",
            error : false,
            success : true,

        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async function uploadAvt(request, response) {
    try {

        const userId = request.userId //auth middleware
        const image = request.file
        const upload = await uploadImageCloudinary(image)
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar : upload.url
        })
        return response.json({
            message : "upload avt profile",
            data : {
                _id : userId,
                avatar : upload.url
            }
        })
        console.log("image", image)
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user info
export async function updateUserInformation(request, response) {
    try {
        const userId = request.userId
        const { name, email, mobile, password } = request.body

        
        let hashPassword = ""

        if(password){
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && {  mobile : mobile }),
            ...(password && { password : hashPassword })
        }, {new : true})

        return response.json({
            message : "update information successfully",
            error : false,
            success : true,
            data : updateUser
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//forgot password
export async function forgotPasswordController(request, response) {
    try {
        const { email} = request.body

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Acount not available",
                error : true,
                success : false
            })
        }


        const otp = generateOpt();
        const expireTime = new Date() + 60 * 60 * 1000;
    
        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp : otp,
            forgot_password_exp : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from InkAos Studio",
            html : forgotPasswordTemplate({
                name : user.name, 
                otp : otp})
        })

        
        return response.json({
            message : "check opt",
            error : false,
            success : true
            
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//verify opt
export async function verifyOneTimePassword(request, response) {
    try {
        const { email, otp } = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide email, otp",
                error : true,
                success : false
            })
        } 
        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Acount not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_exp < currentTime){
            return response.status(400).json({
                message : "Opt is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Opt is incorrect",
                error : true,
                success : false
            })
        }

        const userUpdate = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp : "",
            forgot_password_exp : ""
        })

        return response.json({
            message : "Verify Otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//reset the password
export async function resetPassword(request, response) {
    try {
        
        const { email, newPassword, confirmPassword } = request.body

        if(!email  || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "Provide email,, newPassword, confirmPassword",
                error : true,
                success : false
            })
        } 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Acount not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword are not same",
                error : true,
                success : false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        const updatePassword = await UserModel.findByIdAndUpdate(user.id, {
            password : hashPassword
        })

        return response.json({
            message : "Update Password successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//refresh token controller
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken 
        || request.header.authorization.split(" ")[1]
        
        if(!refreshToken){
            return response.status(400).json({
                message : "Invalid token",
                error : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,
            process.env.SECRET_KEY_REFRESH_TOKEN, 
        )

        if(!verifyToken){
            return response.status(401).json({
                message : "Token is expired",
                error : true,
                success : false
            })
        }

       
        const userId = verifyToken?.id

        const newAccessToken = await generateAccessToken(userId)

        const cookieOption ={
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie("accessToken", newAccessToken,cookieOption)
    
        return response.json({
            message : "New access token generate",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })
    
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get login user info
export async function userDetailLogin(request, response) {
    try {
        const userId = request.userId
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : "user details",
            error : false,
            success : true,
            data : user
        })

    } catch (error) {
        return response.status(500).json({
            message : "Something was wrong",
            error : true,
            success : false
        })
    }
}
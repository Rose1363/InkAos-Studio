import { Router } from "express";
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetPassword, updateUserInformation, uploadAvt, userDetailLogin, verifyEmailController, verifyOneTimePassword } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get("/logout", auth, logoutController)
userRouter.put('/upload-avt', auth, upload.single('avatar'), uploadAvt)
userRouter.put('/update-info', auth, updateUserInformation)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-otp', verifyOneTimePassword)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details',auth, userDetailLogin)
export default userRouter
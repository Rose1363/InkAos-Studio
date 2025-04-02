import UserModel from "../models/user.model.js"
export const admin = async(request, response, next)=>{
    try {
        const userId= request.userId

        const user = await UserModel.findById(userId)
        if(user.role !== "Admin"){
            return response.status(40).json({
                message : "Permission denial",
                error : true,
                success : false
            })
        }
        next()
    } catch (error) {
        return response.status(500).json({
            message: "Permission denial",
            error: true,
            success: false,
          });
    }
}
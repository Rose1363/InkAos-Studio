export const baseURL = "http://localhost:8080"

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgotPassword : {
        url : '/api/user/forgot-password',
        method : 'put'
    },
    verifyOtp : {
        url : '/api/user/verify-otp',
        method : 'put'
    },
    resetPassword : {
        url : '/api/user/reset-password',
        method : 'put'
    },
    userDetailsLogin : {
        url : '/api/user/user-details',
        method : 'get'
    },
    logout : {
        url : '/api/user/logout',
        method : 'get'
    }

   
}

export default SummaryApi
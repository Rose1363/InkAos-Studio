export const baseURL = "http://localhost:8080";

const SummaryApi = {
    register: {
        url: "/api/user/register",
        method: "post",
    },
    login: {
        url: "/api/user/login",
        method: "post",
    },
    forgotPassword: {
        url: "/api/user/forgot-password",
        method: "put",
    },
    verifyOtp: {
        url: "/api/user/verify-otp",
        method: "put",
    },
    resetPassword: {
        url: "/api/user/reset-password",
        method: "put",
    },
    userDetailsLogin: {
        url: "/api/user/user-details",
        method: "get",
    },
    logout: {
        url: "/api/user/logout",
        method: "get",
    },
    uploadAvt: {
        url: "/api/user/upload-avt",
        method: "put",
    },

    updateInfo: {
        url: '/api/user/update-info',
        method: "put"
    },
    addImage: {
        url: "/api/image/upload",
        method: "post",
    },
    createAddress: {
        url: "/api/address/create",
        method: "post",
    },
    getAddress: {
        url: "/api/address/get",
        method: "get",
    },
    updateAddress: {
        url: "/api/address/update",
        method: "put",
    },
    addText : {
        url: "/api/text/add",
        method: "post",
    }
};

export default SummaryApi;

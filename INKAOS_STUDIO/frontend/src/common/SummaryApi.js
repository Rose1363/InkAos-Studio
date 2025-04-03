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
    url: "/api/user/update-info",
    method: "put",
  },
  addCategory: {
    url: "/api/category/add",
    method: "post",
  },
  uploadImage: {
    url: "/api/image/upload",
    method: "post",
  },
  getCategory: {
    url: "/api/category/get",
    method: "get",
  },
  addStyleDesign: {
    url: "/api/style-design/add",
    method: "post",
  },
  getStyleDesign: {
    url: "/api/style-design/get",
    method: "get",
  },
  createProduct: {
    url: "/api/product/create",
    method: "post",
  },
  getProduct: {
    url: "/api/product/get",
    method: "post",
  },
  getProductByCategory: {
    url: "/api/product/get-product-by-category",
    method: "post",
  },
  getProductDetail: {
    url: "/api/product/get-product-detail",
    method: "post",
  },
  updateProduct: {
    url: "/api/product/update",
    method: "put",
  },
  deleteProduct: {
    url: "/api/product/delete",
    method: "delete",
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
  addText: {
    url: "/api/text/add",
    method: "post",
  },
  addDesign: {
    url: "/api/design/add",
    method: "post",
  },
  getDesign: {
    url: "/api/design/get",
    method: "post",
  },
  getPublicDesign: {
    url: "/api/design/get-public-design",
    method: "post",
  },
  getDesignByStyle: {
    url: "/api/design/get-design-by-style",
    method: "post",
  },

  getDesignDetail: {
    url: "/api/design/get-design-detail",
    method: "post",
  },
  updateDesign: {
    url: "/api/design/update",
    method: "put",
  },
  addToCart: {
    url: "/api/cart/add",
    method: "post",
  },
  getCartItem: {
    url: "/api/cart/get",
    method: "post",
  },
  deleteCartItem: {
    url: "/api/cart/delete-cart-item",
    method: "delete",
  },
  getPublicItems: {
    url: "/api/items/public-items",
    method: "GET",
  },
  updateCartItemQuantity: {
    url: "/api/cart/update-quantity",
    method: "PUT",
  },
  
};

export default SummaryApi;

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Design from "../pages/Design";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrder from "../pages/OrderList";
import Address from "../pages/AddressList";
import ProductDisplay from "../pages/ProductDisplay";
import Checkout from "../pages/Checkout";

import AdminUploadDesign from "../pages/AdminUploadDesign";
import AdminDesignList from "../pages/AdminDesignList";

import AdminCategory from "../pages/AdminCategory";
import AdminProduct from "../pages/AdminProduct";
import ProductList from "../pages/AdminProductList";
import AdminStyleDesign from "../pages/AdminStyleDesign";
import DesignList from "../pages/DesignList";
import DesignDisplay from "../pages/DesignDisplay";
import ItemDisplay from "../pages/ItemDisplay";
import DesignProductDisplay from "../pages/DesignProductDisplay";
import UserDesign from "../pages/UserDesign";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import UserOrder from "../pages/UserOrder";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },

      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "otp-verify",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "my-orders",
            element: <UserOrder />,
          },
          {
            path: "order-list",
            element: <MyOrder />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "category",
            element: <AdminCategory />,
          },
          {
            path: "style-design",
            element: <AdminStyleDesign />,
          },
          {
            path: "product",
            element: <AdminProduct />,
          },

          {
            path: "design",
            element: <AdminDesignList />,
          },
          {
            path: "upload-design",
            element: <AdminUploadDesign />,
          },
          {
            path: "user-design",
            element: <UserDesign />,
          },
          
        ],
      },

      {
        path: "design",
        element: <Design />,
      },
      {
        path: "product/:id",
        element: <ProductDisplay />,
      },
      {
        path: "style/:style", 
        element: <DesignList />,
      },
      // {
      //   path: "category/:category", 
      //   element: <ProductList />,
      // },
      {
        path: ":category/:category", 
        element: <ProductList />,
      },
      {
        path: "item/:item", 
        element: <ItemDisplay />,
      },
      {
        path: "design/:id",
        element: <DesignProductDisplay />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },
    ],
  },
]);

export default router;

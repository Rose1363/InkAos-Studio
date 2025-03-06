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
import  Profile  from "../pages/Profile";
import  MyOrder  from "../pages/MyOrder";
import  Address  from "../pages/Address";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "search",
                element: <SearchPage/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "signup",
                element: <Register/>
            },
            
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "otp-verify",
                element : <OtpVerification/>
            },
            {
                path: "reset-password",
                element : <ResetPassword/>
            },
            {
                path: "dashboard",
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                    {
                        path : "my-orders",
                        element : <MyOrder/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    },

                ]
            },
           
            {
                path: "design",
                element: <Design/>,
                children : [
                    {
                        
                    }
                ]
            },
            

        ]
    }
])

export default router;
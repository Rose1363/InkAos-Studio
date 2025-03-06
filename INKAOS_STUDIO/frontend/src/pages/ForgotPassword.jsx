import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
const Login = () => {
    const [data, setData] = useState({
        email : "",
    })

   
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target;
    
        setData((prev) => ({
            ...prev, // Spread the previous state
            [name]: value, // Update the current field
        }));
    };

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
        const response = await Axios({
            ...SummaryApi.forgotPassword,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
               
                setData({
                    email : "",
                })
                navigate("/otp-verify", {
                    state : data
                })
            }

       } catch (error) {
            AxiosToastError(error)
       }

    }
    return (
        <section className='w-full container mx-auto'>
            <div className='bg-white shadow-2xl my-20 w-full max-w-lg mx-auto rounded-md p-8'>
                <p className='text-center font-bold text-3xl'>Quên mật khẩu</p>
                <form className='grid mt-6 py-4' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            autoFocus
                            className='bg-blue-50 p-2 mb-5 rounded-md focus:border-primary'
                            placeholder="Nhập email đã đăng kí tài khoản"
                            required
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                        />
                    </div>
                    <button disabled={!valideValue} className={` ${valideValue ? "bg-primary-darker hover:bg-primary" :  " bg-gray-500" } text-white text-xl font-semibold mt-7 
                    py-2 tracking-wide`}>
                        Gửi Mã OTP
                    </button>

                </form>
                <p className='text-center text-gray-500'>
                    Bạn chưa có tài khoản?
                    <Link to="/signup" className='text-primary-darker hover:underline ml-1'>
                        Đăng kí
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default Login;

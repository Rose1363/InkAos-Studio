import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
const Register = () => {
    const [data, setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
       
    })

    const [showPassWord, setShowPassWord] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

       if(data.password !== data.confirmPassword){
            toast.error(
                "Password and ConfirmPassword are not same"
            )
            return
       }

       try {
        const response = await Axios({
            ...SummaryApi.register,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

       } catch (error) {
            AxiosToastError(error)
       }
       

        


    }

    

    // console.log("data login", data) 
    return (
        <section className='w-full container mx-auto'>
            <div className='bg-white shadow-2xl my-20 w-full max-w-lg mx-auto rounded-md p-8'>
                <p className='text-center font-bold text-3xl'>Tạo tài khoản mới</p>
                <form className='grid mt-6 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="email">Tên của bạn</label>
                        <input
                            type="text"
                            autoFocus
                            required
                            className='bg-blue-50 p-2 mb-5 rounded-md focus:border-primary'
                            placeholder="Nhập tên của bạn"
                            name='name'
                            value={data.name}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            autoFocus
                            className='bg-blue-50 p-2 mb-5 rounded-md focus:border-primary'
                            placeholder="Nhập email của bạn"
                            required
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="password">Mật khẩu mới</label>
                        <div className='relative'>
                            <input
                                type={showPassWord ? "text" : "password"}
                                placeholder='Tạo mật khẩu mới'
                                required
                                className='bg-blue-50 p-2 mb-5 rounded-md focus:border-primary w-full'
                                name='password'
                                value={data.password}
                                onChange={handleOnChange}
                            />

                            <span
                                className='absolute right-3 top-3 cursor-pointer'
                                onClick={() => setShowPassWord(!showPassWord)}
                            >
                                {showPassWord ? <IoIosEyeOff /> : <IoIosEye />}
                            </span>
                        </div>
                        
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="password">Xác nhận mật khẩu</label>
                        <div className='relative'>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder='Nhập mật khẩu vừa tạo'
                            required
                            className='bg-blue-50 p-2 mb-5 rounded-md focus:border-primary w-full'
                            name='confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleOnChange}
                        />

                            <span
                                className='absolute right-3 top-3 cursor-pointer'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
                            </span>
                        </div>
                        
                    </div>

                    <button disabled={!valideValue} className={` ${valideValue ? "bg-primary-darker hover:bg-primary" :  " bg-gray-500" } text-white text-xl font-semibold my-3 
                    py-2 tracking-wide`}>
                        Đăng kí
                    </button>

                </form>
                <p className='text-center text-gray-500'>
                    Bạn đã có tài khoản?
                    <Link to="/login" className='text-primary-darker hover:underline ml-1'>
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </section>
    );
}

export default Register;

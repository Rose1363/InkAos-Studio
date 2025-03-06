import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email : "",
        newPassword : "",
        confirmPassword : "",
    })

    const valideValue = Object.values(data).every(el => el)
    useEffect(()=>{
        if(!(location?.state?.data?.success)){
            navigate("/")
        }
        if(location?.state?.email){
            setData((preve)=>{
               return{
                    ...preve,
                    email : location?.state?.email
               }
            })
        }
    },[])

    console.log("data reset pw", data)
   

    const [showPassWord, setShowPassWord] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
    const handleOnChange = (e) => {
        const { name, value } = e.target;
    
        setData((prev) => ({
            ...prev, // Spread the previous state
            [name]: value, // Update the current field
        }));
    };

    

    const handleSubmit = async(e)=>{
       e.preventDefault()

       
       if(data.newPassword !== data.confirmPassword){
        toast.error(
            "New Password and ConfirmPassword are not same"
        )
        return
   }

       try {
        const response = await Axios({
            ...SummaryApi.resetPassword,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email : "",
                    newPassword : "",
                    confirmPassword : "",
                })
               
            }

       } catch (error) {
            AxiosToastError(error)
       }

    }
    return (
        <section className='w-full container mx-auto'>
            <div className='bg-white shadow-2xl my-20 w-full max-w-lg mx-auto rounded-md p-8'>
                <p className='text-center font-bold text-3xl'>Đặt lại mật khẩu</p>
                <form className='grid mt-6 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <div className='relative'>
                            <input
                                type={showPassWord ? "text" : "password"}
                                placeholder='Nhập mật khẩu mới'
                                required
                                className='bg-blue-50 p-2 rounded-md focus:border-primary w-full mb-3'
                                name='newPassword'
                                value={data.newPassword}
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
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
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

                    <button disabled={!valideValue} className={` ${valideValue ? "bg-primary-darker hover:bg-primary" :  " bg-gray-500" } text-white text-xl font-semibold mt-7 
                    py-2 tracking-wide`}>
                        Xác nhận
                    </button>

                </form>
               
            </div>
        </section>
    );
}

export default ResetPassword;

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const inputRef = useRef([])
   
    const navigate = useNavigate()

    const location = useLocation()

    console.log("location", location)

    useEffect(()=>{
      if(!location?.state?.email){
          navigate("/forgot-password")
      }
    },[])

    const valideValue = data.every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
        const response = await Axios({
            ...SummaryApi.verifyOtp,
            data : {
              otp : data.join(""),
              email : location?.state?.email
            }
        })
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                  state : {
                    data : response.data,
                    email : location?.state?.email
                  }
                })
            }

       } catch (error) {
            AxiosToastError(error)
       }

    }
    return (
        <section className='w-full container mx-auto'>
            <div className='bg-white shadow-2xl my-20 w-full max-w-lg mx-auto rounded-md p-8'>
                <p className='text-center font-bold text-3xl'>Xác Nhận OTP</p>
                <form className='grid mt-6 py-4' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <label htmlFor="otp">Mã OTP</label>
                        <div className='flex items-center justify-between gap-2 mt-3'>
                          {
                            data.map((element, index)=>{
                              return (
                                <input
                                    key={"otp" + index}
                                    type="text"
                                    id='otp'
                                    ref={(ref)=>{
                                      inputRef.current[index] = ref
                                      return ref
                                    }}
                                    value={data[index]}
                                    onChange={(e)=>{
                                      const value = e.target.value
                                      console.log("value",value)
                                      
                                      const newData = [...data]
                                      newData[index] = value
                                      setData(newData)

                                      if(value && index<5){
                                        inputRef.current[index+1].focus()
                                      }
                                    }}
                                    maxLength={1}
                                    className='bg-blue-50 text-center font-bold w-full max-w-15 p-3 border-gray-200 border-1 rounded-md focus:border-primary'
                                />
                              )
                            })
                          }
                        </div>
                        
                    </div>
                    <button disabled={!valideValue} className={` ${valideValue ? "bg-primary-darker hover:bg-primary" :  " bg-gray-500" } text-white text-xl font-semibold mt-7 
                    py-2 tracking-wide`}>
                        Xác nhận OTP
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

export default OtpVerification;

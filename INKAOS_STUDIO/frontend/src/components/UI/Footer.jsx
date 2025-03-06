import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
const Footer = () => {
  return (
    <footer className='border-t bg-slate-200'>
        <div className='container text-center mx-auto p-9 flex flex-col lg:flex-row lg:justify-between'>
        <p>All Rights Reserved 2025.</p>
        <div className='flex justify-center gap-4 text-2xl'>
            <a href="" className='hover:text-primary'><FaFacebookSquare /></a>
            <a href="" className='hover:text-primary'><FaInstagram /></a>
            <a href="" className='hover:text-primary'><AiFillTikTok /></a>
            
        </div>
        </div>
    </footer>
  )
}

export default Footer
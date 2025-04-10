import React from "react";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

import { RiBankFill } from "react-icons/ri";
import { BiCreditCard } from "react-icons/bi";
import { IoCashOutline } from "react-icons/io5";
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-10">
      <div className="container mx-auto px-4 grid grid-cols-1  md:grid-cols-4 gap-8 pb-10">
        {/* Giới thiệu */}
        <div>
          <h2 className="text-xl font-bold mb-4">InkAos Studio</h2>
          <p className="text-sm text-gray-300">
            Chúng tôi chuyên thiết kế và in ấn áo thun độc quyền, sáng tạo và
            đầy cá tính dành cho mọi lứa tuổi.
          </p>
        </div>

        {/* PTTT */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
          <div className="flex gap-4 text-3xl text-white">
            <FaCcVisa className="hover:text-blue-500" title="Visa" />
            <BiCreditCard className="hover:text-red-500" title="MasterCard" />

            <IoCashOutline
              className="hover:text-green-400"
              title="Chuyển khoản ngân hàng"
            />
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h2 className="text-xl font-bold mb-4">Liên hệ</h2>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>📍 3/2, Đại học Cần Thơ</li>
            <li>📞 0123 456 789</li>
            <li>📧 inkaos</li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h2 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h2>
          <div className="flex gap-4 text-3xl text-white">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500">
              <FaFacebookSquare />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-gray-300">
              <AiFillTikTok />
            </a>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="bg-slate-800 text-center text-sm text-gray-400 py-4">
        © {new Date().getFullYear()} InkAos Studio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

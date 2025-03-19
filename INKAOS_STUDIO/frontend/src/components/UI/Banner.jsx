import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import required modules


import banner1 from '../../assets/banner1.jpeg'
import banner2 from '../../assets/banner2.jpeg'
import banner3 from '../../assets/banner3.jpeg'

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Banner = () => {
  // Danh sách hình ảnh (có thể thay bằng dữ liệu động từ API)
  const bannerImages = [
    banner1,
    banner2,
    banner3,
    
  ];

  return (
    <div className="container mx-auto pt-5 px-4">
      <div className=" w-full h-full  rounded-md">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]} // Các module cần dùng
          spaceBetween={0} // Khoảng cách giữa các slide
          slidesPerView={1} // Số slide hiển thị cùng lúc
          navigation // Hiển thị nút prev/next
          pagination={{ clickable: true }} // Hiển thị chấm (dots) và cho phép nhấp
          autoplay={{ delay: 10000, disableOnInteraction: false }} // Tự động chuyển sau 5 giây
          loop // Lặp vô hạn
          className="w-full h-[300px] rounded-md"
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
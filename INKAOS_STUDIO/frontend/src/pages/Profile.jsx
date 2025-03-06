import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaCameraRetro } from "react-icons/fa";

const Profile = () => {
  const user = useSelector(state => state.user)
  const [opendProfileAvtEdit, setProfileAvtEdit] = useState(false)


  return (
    <div className='grid justify-center'>
      <div className='flex justify-center items-center pb-3 w-full'>
      <div className='relative border-2 w-18 h-18 bg-blue-500
                      flex items-center justify-center
                      rounded-full overflow-hidden group cursor-pointer'
      >
        {
          user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          ) : (
            <div className="text-4xl font-bold transition-opacity duration-300 group-hover:opacity-50">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )
        }

        {/* Lớp phủ hiện khi di chuột vào */}
        <div className='absolute text-white text-xs opacity-0 group-hover:opacity-100'>
          <FaCameraRetro size={20}/>
          edit
        </div>
      </div>
      </div>
 {/* Thông tin cá nhân */}
<div className='grid grid-cols-2 gap-4 w-80'>
  <div className='font-semibold text-left'>Tên</div>
  <div className='text-right'>{user.name}</div>

  <div className='font-semibold text-left'>Số điện thoại</div>
  <div className='text-right'>{user.phone || "Chưa cập nhật"}</div>

  <div className='font-semibold text-left'>Email</div>
  <div className='text-right truncate max-w-[150px]'>{user.email}</div>
</div>


      
    </div>
  )
}

export default Profile

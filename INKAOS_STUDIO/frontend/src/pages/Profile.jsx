import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCameraRetro } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import UserProfileAvtEdit from "../components/UI/UserProfileAvtEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError.js";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice.js";
import fetchUserDetails from "../utils/fetchUserDetails.js";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [opendProfileAvtEdit, setProfileAvtEdit] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const toggleEdit = (field) => {
    setEditingField(editingField === field ? null : field);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.name || !userData.email) {
      toast.error("Tên và email không được để trống!");
      return;
    }
    try {
      setLoading(true);
      console.log("Sending data:", userData); // Log dữ liệu gửi đi
      const response = await Axios({
        ...SummaryApi.updateInfo,
        data: userData,
      });
      console.log("Response:", response.data); // Log response từ server
  
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingField(null);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center py-4 bg-gradient-to-r from-gray-100 to-gray-400">
        <div
          onClick={() => setProfileAvtEdit(true)}
          className="relative w-24 h-24 group cursor-pointer"
        >
          <div className="absolute inset-0 border-4 border-white rounded-full shadow-lg overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
              />
            ) : (
              <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-bold transition-opacity duration-300 group-hover:bg-white/90">
                {user.name?.charAt(0).toUpperCase() || ""}
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaCameraRetro size={24} />
            <span className="text-sm mt-1 font-medium">Chọn ảnh</span>
          </div>
        </div>
        {opendProfileAvtEdit && (
          <UserProfileAvtEdit close={() => setProfileAvtEdit(false)} />
        )}
      </div>

      <div className="max-w-2xl mx-auto mt-6 bg-amber-50">
        <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Name Field */}
            <div className="flex items-center justify-between gap-3 group">
              <div className="flex items-center justify-between border-b pb-3 w-full">
                <label className="font-semibold text-gray-700 w-1/3">Tên</label>
                {editingField === "name" ? (
                  <input
                    className="text-gray-600 border-none"
                    type="text"
                    name="name"
                    value={userData.name} // Sử dụng userData thay vì user
                    autoFocus
                    onChange={handleOnChange}
                  />
                ) : (
                  <span className="text-gray-600">{userData.name}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleEdit("name")}
                className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-indigo-600"
              >
                <MdEdit size={20} />
              </button>
            </div>

            {/* Phone Field */}
            <div className="flex items-center justify-between gap-3 group">
              <div className="flex items-center justify-between border-b pb-3 w-full">
                <label className="font-semibold text-gray-700 w-1/3">Số điện thoại</label>
                {editingField === "mobile" ? (
                  <input
                    className="text-gray-600 border-none"
                    type="text"
                    name="mobile"
                    value={userData.mobile} // Sử dụng userData thay vì user
                    autoFocus
                    onChange={handleOnChange}
                  />
                ) : (
                  <span className="text-gray-600">
                    {userData.mobile || (
                      <span className="text-gray-400 italic">Thêm số điện thoại</span>
                    )}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleEdit("mobile")}
                className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-indigo-600"
              >
                <MdEdit size={20} />
              </button>
            </div>

            {/* Email Field */}
            <div className="flex items-center justify-between gap-3 group">
              <div className="flex items-center justify-between border-b pb-3 w-full">
                <label className="font-semibold text-gray-700 w-1/3">Email</label>
                {editingField === "email" ? (
                  <input
                    className="text-gray-600 border-none"
                    type="email" // Đổi thành type="email" để validation tốt hơn
                    name="email"
                    value={userData.email} // Sử dụng userData thay vì user
                    autoFocus
                    onChange={handleOnChange}
                  />
                ) : (
                  <span className="text-gray-600">{userData.email}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleEdit("email")}
                className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-indigo-600"
              >
                <MdEdit size={20} />
              </button>
            </div>
          </div>
          {editingField && (
            <button
              type="submit"
              disabled={loading} // Disable khi đang loading
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400"
            >
              {loading ? "..." : "Lưu"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
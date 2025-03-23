import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { updateAvatar } from "../../store/userSlice";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
const UserProfileAvtEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handelSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.uploadAvt,
        data: formData,
      });
      dispatch(updateAvatar(response.data.data.avatar));
      close();
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">

      <div className="bg-white mx-auto w-full max-w-lg rounded-md shadow-xl max-h-[80vh] flex flex-col justify-center gap-3 items-center p-7">
        <div className="block ml-auto w-fit">
            <button 
            onClick={close}
            className="hover:text-gray-600 hover:scale-90 ">
                <IoClose size={24}/>
            </button>
        </div>
        <div className="w-24 h-24 mb-5 inset-0 border-4 border-white rounded-full shadow-xl shadow-gray-400 overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-bold ">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
          <form onSubmit={handelSubmit} className="w-full flex justify-center">
            <label htmlFor="uploadProfile">
              <div
                className={` text-white text-sm font-bold p-3 rounded-2xl ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                }`}
              >
                {loading ? (<Loading/>) : "Chon anh trong may"}
              </div>
              <input
                onChange={handleUploadAvatar}
                type="file"
                id="uploadProfile"
                className="hidden"
                disabled={loading} 
              accept="image/*" 
              />
            </label>
          </form>

      </div>
    </section>
  );
};

export default UserProfileAvtEdit;

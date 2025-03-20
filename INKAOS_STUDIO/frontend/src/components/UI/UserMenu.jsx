import React from "react";
import Devider from "./Devider";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import { logout } from "../../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import IsAdmin from "../../utils/IsAdmin";
const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };
  return (
    <div className="text-neutral-700 p-3">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <div className="text-sm font-semibold max-w-[220px] text-left">
            {user.name}
            <span className="text-red-700 text-sm px-1">{user.role === "(Admin)" ? "Admin" : ""}</span>
          </div>
          <div className="text-xs text-blue-500 hover:underline">
            <Link onClick={handleClose} to={"/dashboard/profile"}>
              Hồ sơ của tôi
            </Link>
          </div>
        </div>
      </div>
      <Devider />
      <div className="grid text-sm gap-2">
        {IsAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="text-left px-2 hover:font-bold"
          >
            Quản lý
          </Link>
        )}

        <Link
          onClick={handleClose}
          to={"/dashboard/my-orders"}
          className="text-left px-2 hover:font-bold"
        >
          Đơn hàng
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-2 hover:font-bold"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default UserMenu;

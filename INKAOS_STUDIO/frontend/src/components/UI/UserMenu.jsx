import React from "react";
import Devider from "./Devider";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import { logout } from "../../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data.success) {
        close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="text-neutral-700 p-3">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <div className="text-xltext-left">{user.name}</div>
          <div className="text-xs text-blue-500 hover:underline">
            <Link to={"/dashboard/profile"}>Tài khoản của bạn</Link>
          </div>
        </div>
      </div>
      <Devider />
      <div className="grid text-sm gap-2">
        <Link
          to={"/dashboard/my-orders"}
          className="text-left px-2 hover:font-bold"
        >
          My Orders
        </Link>
        <Link
          to={"/dashboard/address"}
          className="text-left px-2 hover:font-bold"
        >
          Save Address
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

import React from "react";
import { Outlet, Link } from "react-router-dom";
import Devider from "../components/UI/Devider";
import { useSelector } from "react-redux";
import IsAdmin from "../utils/IsAdmin";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  // console.log("user dashboard", user);

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto p-3 flex">
        <div className="flex-[1] py-4 sticky top-24 max-h-[calc(100vh-400px)] border-gray-100 border-r-2 pl-5 text-xl">
          <div className="text-neutral-700 p-3">
          <div className="text-md font-semibold max-w-[220px] text-left grid">
            {user.name}
            <span className="text-red-700 text-sm">{user.role === "Admin" ? "Admin" : ""}</span>
          </div>
          <Devider />
            {/* Tài khoản người dùng */}
            <div className="text-lg font-semibold mb-2">Tài khoản</div>
            <div className="grid text-sm gap-2 mb-4">
              <Link
                to={"/dashboard/profile"}
                className="text-left px-2 hover:font-bold"
              >
                Hồ sơ của tôi
              </Link>
              <Link
                to={"/dashboard/address"}
                className="text-left px-2 hover:font-bold"
              >
                Địa chỉ
              </Link>
            </div>

            {/* Quản lý của admin */}
            {IsAdmin(user?.role) && (
              <>
                <Devider />
                <div className="text-lg font-semibold mb-2">Quản lý</div>
                <div className="grid text-sm gap-2 mb-4">
                  <Link
                    to={"/dashboard/category"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Danh mục sản phẩm
                  </Link>
                  <Link
                    to={"/dashboard/sub-category"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Danh mục sản phẩm con
                  </Link>
                  <Link
                    to={"/dashboard/product"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Sản phẩm
                  </Link>
                  <Link
                    to={"/dashboard/upload-product"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Thêm sản phẩm
                  </Link>
                  <Link
                    to={"/dashboard/design-theme"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Phong cách thiết kế
                  </Link>
                  <Link
                    to={"/dashboard/design"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Thiết kế
                  </Link>
                  <Link
                    to={"/dashboard/upload-design"}
                    className="text-left px-2 hover:font-bold"
                  >
                    Thêm thiết kế
                  </Link>
                </div>
              </>
            )}

            {/* Đơn mua */}
            <Devider />
            <div className="text-lg font-semibold mb-2">Đơn mua</div>
            <div className="grid text-sm gap-2 mb-4">
              <Link
                to={"/dashboard/my-orders"}
                className="text-left px-2 hover:font-bold"
              >
                Đơn hàng
              </Link>
            </div>

            {/* Đăng xuất */}
            <Devider />
            <div className="grid text-sm gap-2">
              <Link to={"/"} className="text-left px-2 hover:font-bold">
                Đăng xuất
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-[3] min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
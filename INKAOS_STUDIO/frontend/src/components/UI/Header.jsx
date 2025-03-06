import React, { useState } from "react";
import logo from "../../assets/logo.png";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { PiMagicWand } from "react-icons/pi";
import { useSelector } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const redirectToLoginPage = () => {
    navigate("/login");
  };
  const redirectToDesignPage = () => {
    navigate("/design");
  };
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // Toggle trạng thái của menu
  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const [openDesignMenu, setOpenDesignMenu] = useState(false);

  // Toggle trạng thái của menu
  const toggleDesignMenu = () => {
    setOpenDesignMenu((prevState) => !prevState);
  };

  const renderUserAvatar = () => {
    if (!user?._id) {
      return (
        <div
          onClick={redirectToLoginPage}
          className="flex justify-center items-center
                   bg-primary-darker h-12 w-12 
                   rounded-full border-2"
        >
          <FaRegUser size={22} className="animate-bounce" />
        </div>
      );
    }

    if (user.avatar) {
      return (
        <div className="relative">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-12 w-12 rounded-full border-2 cursor-pointer"
            onClick={() => setOpenUserMenu((prev) => !prev)}
          />
          {openUserMenu && (
            <div className="absolute right-0 top-full mt-2">
              <div className="min-w-52 bg-stone-50 rounded-md shadow-2xl">
                <UserMenu close={handleCloseUserMenu} />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center text-2xl bg-primary-darker border-2 h-12 w-12 rounded-full">
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header className="h-20 shadow-md bg-primary sticky top-0 z-1000">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        {/* logo */}
        <div className="h-full">
          <Link to={"/"} className="h-full flex justify-center items-center">
            <img src={logo} width={145} alt="InkAos Studio" />
          </Link>
        </div>
        {/* search */}
        <div className="hidden lg:block">
          <Search />
        </div>
        {/* pen, account and cart */}
        <div className="items-center text-neutral-200 flex  gap-10 w-ful">
          {/* pen */}
          <div className="animate-pulse">
            <button onClick={() => navigate("/design")}>
              <PiMagicWand size={35} />
            </button>
          </div>
          {/* Cart */}
          <div>
            <button className="relative hidden lg:block">
              <div>
                <TiShoppingCart size={35} />
              </div>
              <div
                className="absolute top-0 right-0 rounded-full 
                                  transform translate-x-1/2 -translate-y-1/2
                                 bg-red-800 text-white 
                                 text-xs px-1 py-0.5 flex items-center 
                                 justify-center"
              >
                99
              </div>
            </button>
          </div>
          {/* account */}
          <div>{renderUserAvatar()}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;

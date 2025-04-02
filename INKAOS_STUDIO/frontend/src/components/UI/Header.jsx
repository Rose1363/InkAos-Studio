import React, { useState } from "react";
import logo from "../../assets/logo.png";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { PiMagicWand } from "react-icons/pi";
import { useSelector } from "react-redux";
import CartDisplay from "./CartDisplay";
const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [opendCartSection, setOpenCartSection] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <header className="h-20 shadow-md bg-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        {/* logo */}
        <div className="h-full">
          <Link to={"/"} className="h-full flex justify-center items-center z-20">
            <img src={logo} width={140} alt="InkAos Studio" className="object-contain h-full" />
          </Link>
        </div>
        {/* search */}
        {/* <div className="hidden lg:block">
          <Search />
        </div> */}
        {/* pen, account and cart */}
        <div className="items-center text-neutral-200 flex  gap-10 w-ful">
          {/* pen */}
          <div className="animate-pulse text-primary-darker">
            <button aria-label="design" onClick={() => navigate("/design")}>
              <PiMagicWand size={35} />
            </button>
          </div>
          {/* Cart */}
          <div>
            <button
            aria-label="cart"
              onClick={() => setOpenCartSection(true)}
              className="text-primary-darker relative lg:block"
            >
              <div>
                <TiShoppingCart size={35} />
              </div>
              <div
                className="absolute top-0 right-0 rounded-full 
                                  transform translate-x-1/2 -translate-y-1/2
                                 bg-red-800 text-white 
                                 text-xs px-1 flex items-center 
                                 justify-center"
              >
               {
                cartItem[0]?(
                `${cartItem.length}`):("0")
               }
              </div>
            </button>
          </div>
          {/* account */}
          <div>
            {user._id && user.avatar ? (
              <div className="relative">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full border-2 cursor-pointer"
                  onClick={() => setOpenUserMenu((prev) => !prev)}
                />
              </div>
            ) : user.name ? (
              <div
                onClick={() => setOpenUserMenu((prev) => !prev)}
                className="flex justify-center items-center text-2xl bg-primary-darker border-2 h-12 w-12 rounded-full cursor-pointer"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div
                onClick={() => navigate("/login")}
                className="flex justify-center items-center
                     bg-primary-darker h-12 w-12 
                     rounded-full border-2"
              >
                <FaRegUser size={22} className="animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>

      {opendCartSection && (
        <CartDisplay close={() => setOpenCartSection(false)} />
      )}
      {openUserMenu && (
        <div className="absolute right-0 top-full mt-2">
          <div className="min-w-52 bg-stone-50 rounded-md shadow-2xl">
            <UserMenu close={()=>setOpenUserMenu(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

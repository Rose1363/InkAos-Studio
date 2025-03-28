import React from "react";
import MenuButton from "./MenuButton";
import { LuRectangleHorizontal, LuTypeOutline } from "react-icons/lu";
import { ImUpload } from "react-icons/im";
import { PiSelectionBackground, PiSelectionBackgroundDuotone, PiTShirtDuotone } from "react-icons/pi";
import { FaRectangleXmark, FaRegRectangleList, FaShapes } from "react-icons/fa6";

const DesignMenu = ({ togglePanel }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền lên window
  };

  return (
    <div
      className="bg-gray-800 z-10 w-25 py-5 text-white h-full flex flex-col items-center"
      onClick={handleClick} // Thêm sự kiện click để ngăn lan truyền
    >
      <MenuButton
        icon={<LuTypeOutline size={27} />}
        lable="van ban"
        title="Nhap van ban"
        onClick={() => togglePanel("text")}
        hoverClass="group-hover:text-amber-300"
      />
      <MenuButton
        icon={<ImUpload size={27} />}
        lable="tai len"
        title="len hinh anh tu may"
        onClick={() => togglePanel("upload")}
        hoverClass="group-hover:text-blue-300"
      />
      <MenuButton
        icon={<FaShapes size={27} />}
        lable="hinh dang"
        title="len hinh anh tu may"
        onClick={() => togglePanel("shape")}
        hoverClass="group-hover:text-red-300"
      />
      {/* <MenuButton
        icon={<LuRectangleHorizontal size={29} />}
        lable="background"
        title="chon background"
        onClick={() => togglePanel("background")}
        hoverClass="group-hover:text-pink-300"
      /> */}
      {/* <MenuButton
        icon={<PiTShirtDuotone size={29} />}
        lable="background"
        title="chon background"
        onClick={() => togglePanel("background")}
        hoverClass="group-hover:text-pink-300"
      /> */}
    </div>
  );
};

export default DesignMenu;
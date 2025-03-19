import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TestData from "../data/TestData";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Devider from "../components/UI/Devider";
import tshirtPhoto from "../assets/photo.png";
import CategoryWiseProductDisplay from "../pages/CategoryWiseProductDisplay";
const ProductDisplay = () => {
  const { id } = useParams();
  const product = TestData.find((item) => item.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  // State để lưu hình ảnh hiện tại, màu áo thun và số lượng
  const [currentImage, setCurrentImage] = useState(0);
  const [tshirtColor, setTshirtColor] = useState("bg-white"); // Mặc định là màu trắng
  const [quantity, setQuantity] = useState(1);
  const imageContainer = useRef();

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100; // Sửa từ += thành -= để scroll trái
  };

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Mảng chứa tất cả hình ảnh, bao gồm áo thun
  const imagesWithTshirt = [...product.images, tshirtPhoto];
  const tshirtIndex = imagesWithTshirt.length - 1;

  return (
    <section className="container mx-auto py-4 grid gap-20">
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 ">
          <div className="px-30 p-5 bg-slate-100 rounded-l-2xl">
            <div className="relative bg-slate-100 lg:min-h-[70vh] lg:max-h-[70vh] rounded min-h-70 max-h-70 h-full">
              {currentImage === tshirtIndex ? (
                <div className={`relative w-full h-full ${tshirtColor} `}>
                 
                  <img
                    src={tshirtPhoto}
                    alt="T-shirt"
                    className="w-full h-full object-contain"
                  />
                  
                  <img
                    src={product.images[0]}
                    alt="Product on T-shirt"
                    className="w-fit absolute top-1/3 left-1/2 transform -translate-x-1/2 h-1/3 object-contain"
                  />
                </div>
              ) : (
                <img
                  src={imagesWithTshirt[currentImage]}
                  alt="Product"
                  className="w-full h-full object-scale-down"
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-3 mt-2 ">
              {imagesWithTshirt.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`cursor-pointer bg-slate-200 w-4 h-4 rounded-full ${
                    index === currentImage ? "bg-slate-500" : ""
                  }`}
                ></div>
              ))}
            </div>

            <div className="grid relative -mx-20">
              <div
                ref={imageContainer}
                className="flex gap-4 relative w-full z-10 overflow-x-auto"
              >
                {imagesWithTshirt.map((img, index) => (
                  <div className="relative w-20 shadow-2xs cursor-pointer flex-shrink-0">
                    {index === tshirtIndex ? (
                      <div className={`relative w-full h-full ${tshirtColor}`}>
                        <img
                          src={tshirtPhoto}
                          alt="T-shirt"
                          onClick={() => setCurrentImage(index)}
                          className="w-full h-full object-contain"
                        />
                        <img
                          src={product.images[0]}
                          alt="Product on T-shirt"
                          onClick={() => setCurrentImage(index)}
                          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 object-contain"
                        />
                      </div>
                    ) : (
                      <img
                        src={img}
                        alt="min-product"
                        onClick={() => setCurrentImage(index)}
                        className="w-full h-full object-scale-down"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex -ml-3 justify-between items-center w-full h-full absolute">
                <button
                  onClick={handleScrollLeft}
                  className="z-10 bg-white relative p-1 rounded-full shadow"
                >
                  <FaAngleLeft />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="z-10 bg-white relative p-1 rounded-full shadow"
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 pl-6 rounded-r-2xl bg-amber-50 ">
            <h2 className="text-lg lg:text-3xl font-semibold mb-5">
              {product.name}
            </h2>
            <Devider />
            <div className="grid gap-5 my-10 px-5">
              <div>
                <p className="mb-2 -ml-2">Giá</p>
                <div className="text-black px-7 py-2 bg-green-100 w-fit rounded border border-green-400">
                  <p>{product.price}</p>
                </div>
                <p className="mb-2 text-xs">1 áo</p>
              </div>

              <div>
                <p className="mb-2 -ml-2">Kích cỡ</p>
                <div className="flex gap-2">
                  <button className="border border-gray-400 w-14 h-11 bg-white rounded text-black">
                    S
                  </button>
                  <button className="border border-gray-400 w-14 h-11 bg-white rounded text-black">
                    M
                  </button>
                  <button className="border border-gray-400 w-14 h-11 bg-white rounded text-black">
                    L
                  </button>
                  <button className="border border-gray-400 w-14 h-11 bg-white rounded text-black">
                    XL
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 -ml-2">Kiểu dáng</p>
                <select className="border bg-white text-black rounded p-2 px-5 pr-6">
                  <option value="tshirt">T-shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="kid">Kid</option>
                  <option value="tanktop">Tank top</option>
                </select>
              </div>

              <div>
                <p className="mb-2 -ml-2">Màu sắc</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTshirtColor("bg-white")}
                    className="rounded-full border-gray-950 w-11 h-11 bg-white"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-black")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-black"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-primary")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-blue-400"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-[#0e6729]")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-[#0e6729]"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-red-900")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-red-900"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-pink-100")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-pink-400"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-gray-700")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-gray-700"
                  ></button>
                  <button
                    onClick={() => setTshirtColor("bg-primary-darker")}
                    className="rounded-full border-gray-400 w-11 h-11 bg-primary-darker"
                  ></button>
                </div>
              </div>

              <div>
                <p className="mb-2 -ml-2">Số lượng</p>
                <div className="flex items-center bg-white w-fit rounded px-2">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-1 text-black text-xl"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="mx-2 w-10 text-center text-black"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-1 text-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <Devider />
            <div className="flex gap-5 items-center justify-center mt-10">
              <button className="px-4 py-2 border bg-white text-red-700 border-red-700 rounded">
                Thêm vào giỏ hàng
              </button>
              <button className="px-4 py-2 border bg-red-700 rounded text-white">
                Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="font-bold">Có thể bạn sẽ thích</h1>
        <CategoryWiseProductDisplay />
      </div>

      <div>
        <div className="flex justify-between gap-10 shadow rounded-2xl">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Chi tiết về áo thun
            </h1>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Phong cách: Áo thun Unisex
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Thoải mái, đơn giản và dễ dàng phối hợp với nhiều phong cách. Được
              làm từ 100% cotton, form áo unisex phù hợp với cả nam va nữ. Đường
              may đôi chắc chắn và tăng tính thẩm mỹ
            </p>

            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Kích cỡ & Phom dáng
              </h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>Phom dáng tiêu chuẩn</li>
                <li>Áo unisex, phù hợp cho mọi giới tính</li>
                <li>Phù hợp với kích thước chuẩn</li>
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Chất liệu & Bảo quản
              </h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>100% cotton</li>
                <li>Viền tay và thân áo được khâu hai kim chắc chắn</li>
                <li>Giặt áo bằng nước lạnh hoặc nước ấm để giữ màu sắc và chất
                liệu lâu bền.</li>
                <li>Sản phẩm made in Việt Nam</li>
              </ul>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Chi tiết về thiết kế
            </h1>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Cảm hứng thiết kế
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Lảm hứng từ con vật được nhiều người yêu thích - Capypara, thiết kế
              mang phong cách đơn giản nhưng không kém phần dễ thương, ngộ nghĩnh
            </p>

            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Kĩ thuật in (In kỹ thuật số)
              </h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>
                  Sử dụng công nghệ in kỹ thuật số DTG, hình ảnh được in trực
                  tiếp lên áo mà không cần khuôn, giúp giữ nguyên độ sắc nét và
                  độ chi tiết của thiết kế.
                </li>
                <li>
                  Phương pháp in này cho phép in đa dạng màu sắc và các họa tiết
                  phức tạp, thích hợp cho các thiết kế có độ chi tiết cao.
                </li>
                <li>
                  Mực in bám chắc vào vải và có độ bền cao, cho phép áo thun giữ
                  màu sắc tươi sáng qua nhiều lần giặt.
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Bảo quản
              </h2>
              <ul className="list-disc list-inside text-gray-600">
                
                <li>
                  Không dùng chất tẩy rửa mạnh, tránh chà xát quá mạnh lên bề
                  mặt in.
                </li>
                <li>
                  Phơi áo ở nơi thoáng mát, tránh ánh nắng trực tiếp quá lâu vì
                  có thể làm mờ hình in.
                </li>
                <li>
                  Ủi áo từ mặt trái và tránh ủi trực tiếp lên bề mặt in để tránh
                  làm hỏng hình in.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;

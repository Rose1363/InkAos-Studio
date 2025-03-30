import React, { useEffect, useState } from "react";
import {
  BiSolidQuoteAltRight,
  BiSolidMoviePlay,
  BiHappyBeaming,
} from "react-icons/bi";
import { FcCloseUpMode } from "react-icons/fc";
import { PiDogFill } from "react-icons/pi";
import { MdSelectAll } from "react-icons/md";
import { FaAt } from "react-icons/fa";
import CardLoading from "../components/UI/CardLoading";
import testData from "../data/TestData";
import CardProduct from "../components/UI/CardProduct";
import CategoryWiseProductDisplay from "./CategoryWiseProductDisplay";
import CategoryButton from "../components/UI/CategoryButton";
import Banner from "../components/UI/Banner";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  const navigate = useNavigate();

  const redirectProductListPage = (id, category) => {
    console.log("id:", id, "category:", category);

    const subcategory = subCategoryData.find((sub) => {
      // Kiểm tra xem sub.category tồn tại và _id khớp với id
      return sub.category && sub.category._id === id;
    });
    const url = `/${validURLConvert(category)}-${id}/${validURLConvert(
      subcategory.name
    )}`;
    navigate(url);
  };
  // UseEffect to handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-[#1e293b]">
      {/* <Banner /> */}

      {/* Category Buttons */}
      <div className="flex gap-16 justify-center">
        {/* <div className="flex gap-9 my-6">
          <CategoryButton
            label="Quote"
            icon={<BiSolidQuoteAltRight color="#006400" size={22} />}
          />
          <CategoryButton
            label="Basic"
            icon={<FaAt color="#4b4b4b" size={25} />}
          />
          <CategoryButton
            label="Funny"
            icon={<BiHappyBeaming color="#ff8c00" size={30} />}
          />
          <CategoryButton
            label="Movie"
            icon={<BiSolidMoviePlay color="#c30c23" size={25} />}
          />
          <CategoryButton
            label="Animal"
            icon={<PiDogFill color="#654321" size={25} />}
          />
          <CategoryButton label="Cute" icon={<FcCloseUpMode size={30} />} />
          <CategoryButton
            label="All"
            icon={<MdSelectAll color="#000000" size={25} />}
          />
        </div> */}
        <div className="flex  gap-9 my-6">
          {categoryData.map((category, index) => {
            return (
              <div
                key={index}
                onClick={() =>
                  redirectProductListPage(category._id, category.name)
                }
                className="w-25 h-25 flex flex-col items-center"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-14 h-14 object-fill rounded-full border border-gray-200"
                />
                <span className="text-xs text-white">{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Section */}

       <div>
        {categoryData.map((category, index) => {
          console.log(category._id)
          return (
            
            <CategoryWiseProductDisplay
              // key={category?._id + "CategoryWiseProduct"}
              id={category?._id}
              name={category.name}
            />
          );
        })}
      </div>

      {/* <div>
        <h1 className="text-white mx-auto container font-bold">Sản phẩm mới</h1>
        <CategoryWiseProductDisplay loading={loading} />
      </div>

      <div className="container mx-auto py-3.5">
        <div className="mx-3 my-2 grid md:grid-cols-3 lg:grid-cols-6 gap-5">
          {loading
            ? Array.from({ length: 18 }).map((_, index) => (
                <div key={index} className="w-full">
                  <CardLoading />
                </div>
              ))
            : testData.map((product) => (
                <CardProduct key={product.id} product={product} />
              ))}
        </div>
      </div>  */}
    </section>
  );
};

export default Home;

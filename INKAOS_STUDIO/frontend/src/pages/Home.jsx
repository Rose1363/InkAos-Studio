import React, { useEffect, useState } from "react";
import CategoryWiseProductDisplay from "./CategoryWiseProductDisplay";
import CategoryButton from "../components/UI/CategoryButton";
import Banner from "../components/UI/Banner";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import PublicDesigns from "./PublicDesigns";
import ProductList from "./AdminProductList";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const allStyleDesign = useSelector((state) => state.design.allStyleDesign);

  const navigate = useNavigate();

  const redirectToDesignList = (id, name) => {
    const url = `/style/${validURLConvert(name)}-${id}`;
    navigate(url);
  };

  const redirectToProductList = (id, name) => {
    const url = `/${name.toString().replaceAll(" ", "")}/${validURLConvert(name)}-${id}`;
    navigate(url);
    
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-[#1e293b] min-h-screen">

     
      {/* Category Buttons */}
      <div className=" py-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center items-end gap-6">
            {/* Style Designs */}
            {allStyleDesign.map((style, index) => (
              <button
                key={index}
                onClick={() => redirectToDesignList(style._id, style.name)}
                className="flex flex-col items-center justify-center w-24 transition-transform transform hover:scale-105"
              >
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-12 h-12 object-cover rounded-full border-2 border-gray-200 shadow-md"
                />
                <span className="text-xs text-white mt-2 font-medium">
                  {style.name}
                </span>

              </button>
            ))}
            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-gray-300 mx-4 self-center" />
            {/* Categories */}
            {categoryData.map((category, index) => (
              <button
                key={index}
                onClick={() =>
                  redirectToProductList(category._id, category.name)
                }
                className="flex flex-col items-center justify-center w-24 transition-transform transform hover:scale-105"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded-full border-2 border-gray-200 shadow-md"
                />
                <span className="text-xs text-white mt-2 font-medium">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
     
<div>

  <PublicDesigns/>

 
</div>

<div>
<ProductList/>
</div>
      {/* Product Section */}
      <div className="container mx-auto py-6">
        {categoryData.map((category) => (
          <CategoryWiseProductDisplay
            key={`${category?._id}-CategoryWiseProduct`}
            id={category?._id}
            name={category.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
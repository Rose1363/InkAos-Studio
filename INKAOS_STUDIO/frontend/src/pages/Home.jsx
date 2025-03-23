import React, { useEffect, useState } from "react";
import { BiSolidQuoteAltRight, BiSolidMoviePlay, BiHappyBeaming } from "react-icons/bi";
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

const Home = () => {
  const [loading, setLoading] = useState(true);

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
      <Banner />

      {/* Category Buttons */}
      <div className="flex justify-center gap-14 my-7">
        <CategoryButton label="Quote" icon={<BiSolidQuoteAltRight color="#006400" size={22} />} />
        <CategoryButton label="Basic" icon={<FaAt color="#4b4b4b" size={25} />} />
        <CategoryButton label="Funny" icon={<BiHappyBeaming color="#ff8c00" size={30} />} />
        <CategoryButton label="Movie" icon={<BiSolidMoviePlay color="#c30c23" size={25} />} />
        <CategoryButton label="Animal" icon={<PiDogFill color="#654321" size={25} />} />
        <CategoryButton label="Cute" icon={<FcCloseUpMode size={30} />} />
        <CategoryButton label="All" icon={<MdSelectAll color="#000000" size={25} />} />
      </div>

      {/* Product Section */}
      <div>
        <h1 className="text-white mx-auto container font-bold">Sản phẩm mới</h1>
        <CategoryWiseProductDisplay loading={loading} />
      </div>

      <div className="container mx-auto py-3.5">
        <div className="mx-3 my-2 grid md:grid-cols-3 lg:grid-cols-6 gap-5">
          {loading ? (
            Array.from({ length: 18 }).map((_, index) => (
              <div key={index} className="w-full">
                <CardLoading />
              </div>
            ))
          ) : (
            testData.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;

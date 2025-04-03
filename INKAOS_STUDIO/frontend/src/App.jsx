import { Outlet } from "react-router-dom";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { setAllCategory, setLoadingCategory } from "./store/productSlice";
import Axios from "./utils/Axios";
import { setStyleDesign } from "./store/designSlice";
import SummaryApi from "./common/SummaryApi";
import { handleAddItemCart } from "./store/cartSlice";
import GlobalProvider from "./provider/GlobalProvider";
function App() {
  const dispatch = useDispatch();
  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...SummaryApi.getCategory,
      });

      if (response.data.success) {
        dispatch(setAllCategory(response.data.data));
      }
    } catch (error) {
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchStyleDesign = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getStyleDesign,
      });

      if (response.data.success) {
        dispatch(setStyleDesign(response.data.data));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchCartItem = async () => {
    
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      if (response.data.success) {
        dispatch(handleAddItemCart(response.data.data));
        console.log(response.data.data);
      } else {
        toast.error(response.data.message || "Không thể tải giỏ hàng!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải giỏ hàng!");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchStyleDesign();
    // fetchCartItem();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        toastOptions={{
          duration: 1000, // Thời gian hiển thị (ms)
          style: {
            zIndex: 100, // Cao hơn modal
          },
        }}
      />
    </GlobalProvider>
  );
}

export default App;

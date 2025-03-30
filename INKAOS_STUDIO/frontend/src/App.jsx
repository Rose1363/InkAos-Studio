import { Outlet } from "react-router-dom";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./store/productSlice";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
function App() {
  const dispatch = useDispatch();
  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory,
      });

      if (response.data.success) {
        dispatch(setAllCategory(response.data.data));
      }
    } catch (error) {
    } finally {
      dispatch(setLoadingCategory(false))
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });

      if (response.data.success) {
        dispatch(setAllSubCategory(response.data.data));
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory()
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        toastOptions={{
          duration: 5000, // Thời gian hiển thị (ms)
          style: {
            zIndex: 100, // Cao hơn modal
          },
        }}
      />
    </>
  );
}

export default App;

import { createContext, useContext, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleAddItemCart } from "../store/cartSlice";
import AxiosToastError from "../utils/AxiosToastError";

const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      if (response.data.success) {
        dispatch(handleAddItemCart(response.data.data));
        // console.log(response.data.data);
      } else {
        toast.error(response.data.message || "Không thể tải giỏ hàng!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải giỏ hàng!");
      console.log(error);
    }
  };

  const deteleCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message)
        fetchCartItem()
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCartItem();
  }, []);
  return (
    <GlobalContext.Provider value={{ fetchCartItem, deteleCartItem }}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;

import { createContext, useContext, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartSlice";
import AxiosToastError from "../utils/AxiosToastError";
import { handleAddAddress } from "../store/addressSlice";
import { useNavigate } from "react-router-dom";
import { setOrder } from "../store/orderSlice";

const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state.cartItem.cart);

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
        toast.success(response.data.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      if (response.data.success) {
        dispatch(handleAddAddress(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleLogOut = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };



  useEffect(() => {
    fetchCartItem();
    handleLogOut();
    fetchAddress();
    
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{ fetchCartItem, deteleCartItem, fetchAddress }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;

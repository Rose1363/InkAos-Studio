import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    addressList : []
}

const addressSlice = createSlice({
    name: "address",
    initialState : initialValue,
    reducers : {
        handleAddAddress : (state, action)=>{
            // state.addressList = [...action.payload]

            const payload = action.payload;
      if (!payload) return; // Tránh lỗi nếu payload là null/undefined
      if (Array.isArray(payload)) {
        state.addressList = [...payload]; // Thay toàn bộ danh sách nếu là mảng
      } else {
        // Thay thế địa chỉ cũ bằng địa chỉ mới dựa trên _id
        const index = state.addressList.findIndex(addr => addr._id === payload._id);
        if (index >= 0) {
          state.addressList[index] = payload; // Cập nhật địa chỉ cũ
        } else {
          state.addressList.push(payload); // Thêm mới nếu không tìm thấy
        }
      }
    
        }
    }
})

export const {handleAddAddress} = addressSlice.actions
export default addressSlice.reducer


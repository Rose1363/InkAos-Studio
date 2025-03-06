import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
  _id : "",
  name : "",
  email : "",
  avatar : "",
  mobile : "",
  verify_email : "",
  last_login_date: "",
  status : "",
  address_details : [],
  role : ""

}

export const userSlice = createSlice({
  name: 'user',
  initialState : initialValue,
  reducers: {
    setUserDetails : (state, action) => {
        state._id = action.payload?._id,
        state.name = action.payload?.name,
        state.email = action.payload?.email,
        state.avatar = action.payload?.avatar,
        state.mobile = action.payload?.mobile,
        state.verify_email = action.payload?.verify_email,
        state.last_login_date = action.payload?.last_login_date,
        state.status = action.payload?.status,
        state.address_details = action.payload?.address_details,
        state.role = action.payload?.role
        
    },
    logout : (state, action) => {
        state._id = "",
        state.name = "",
        state.email = "",
        state.avatar = "",
        state.mobile = "",
        state.verify_email = "",
        state.last_login_date = "",
        state.status = "",
        state.address_details = [],
        state.role = ""
        
    },
  },
})

// Action creators are generated for each case reducer function
export const {setUserDetails, logout } = userSlice.actions

export default userSlice.reducer
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import addressReducer from './addressSlice.js'
import productReducer from './productSlice.js'
import designReducer from './designSlice.js'
export const store = configureStore({
  reducer: {
    user : userReducer,
    product : productReducer,
    design : designReducer,
    addresses : addressReducer
  },
})


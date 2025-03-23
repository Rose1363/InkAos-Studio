import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import addressReducer from './addressSlice.js'
import productReducer from './productSlice.js'
export const store = configureStore({
  reducer: {
    user : userReducer,
    product : productReducer,
    addresses : addressReducer
  },
})


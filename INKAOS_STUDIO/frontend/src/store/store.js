import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import addressReducer from './addressSlice.js'
export const store = configureStore({
  reducer: {
    user : userReducer,
    addresses : addressReducer
  },
})


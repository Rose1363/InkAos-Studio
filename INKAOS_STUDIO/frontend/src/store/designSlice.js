import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
   
    allStyleDesign: [],
    design : []
}

const designSlice = createSlice({
    name: 'design',
    initialState : initialValue,
    reducers : {
       
        setStyleDesign : (state, action)=>{
            state.allStyleDesign = [...action.payload]
        }
    }
})

export const { setStyleDesign } = designSlice.actions

export default designSlice.reducer
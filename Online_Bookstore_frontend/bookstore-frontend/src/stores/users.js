import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    userData : null,
    isLoading: false,
    error : null
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setUserData(state,action){
            state.userData = action.payload;
            state.error = null;
        },

        setLoading(state,action){
            state.isLoading = action.payload;
        },
        setError(state,action){
            state.error = action.payload;

        },
        clearUserData(state){
            state.userData = null;
            state.error = null;
        }
    }
})

export const { setUserData, setLoading, setError, clearUserData } = userSlice.actions;
export default userSlice.reducer;


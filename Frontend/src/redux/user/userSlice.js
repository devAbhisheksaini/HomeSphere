import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentUser: null,
    error: "",
    loading: false,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};
// const initialState = {
//     signupData: null,
//     loading: false,

// };
const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, value) => {
            state.currentUser = value.payload;
            state.loading = false;
            state.error = "";
            console.log(`asdlkkldsjkldsfj${value.payload}`)
        },
        signInFailure: (state, value) => {
            console.log(`singig${value.payload}`)
            state.error = value.payload;
            state.loading = false;
        },
        signInEnd: (state) => {
            state.loading = false;
        }
        ,
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        startloading: (state) => {
            state.loading = true;
        },
        endloading: (state) => {
            state.loading = false;
        },
        setError: (state, value) => {
            // console.log(`singig${value.payload}`)
            state.error = value.payload;
            state.loading = false;
        },
    }
});
export const { signInFailure, signInStart, signInSuccess, signInEnd, updateUserStart, updateUserSuccess, updateUserFailure, startloading, endloading, setError } = userSlice.actions;
export default userSlice.reducer;
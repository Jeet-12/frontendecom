import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  token: localStorage.getItem("token") || false,
  isLoggedIn: localStorage.getItem("token") ? true : false,
  darkMode: true,
  // user: null, // Will hold user information including role

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state) => {
      state.isLoggedIn = true;
      state.token = localStorage.getItem("token");
      toast.success("You have successfuly logged in");
      // state.user = action.payload; 
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.token = false;
      toast.success("You have successfuly logout");
      // state.user = null;
    },
    changeMode: (state) => {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.querySelector("html").setAttribute("data-theme", "dark");
      } else {
        document.querySelector("html").setAttribute("data-theme", "winter");
      }
    },
  },
});

// console.log(cartSlice);
export const { loginUser, logoutUser, changeMode } = authSlice.actions;

export default authSlice.reducer;

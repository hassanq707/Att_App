import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/UserSlice"; 
import TokenSlice from "./slices/TokenSlice"; 

const store = configureStore({
  reducer: {
    data: UserSlice, 
    auth : TokenSlice
  },
});

export default store;

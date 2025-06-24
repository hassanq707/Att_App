import { createSlice } from "@reduxjs/toolkit";

const initial_state = {
    token : null
}

const TokenSlice = createSlice({
  name: "auth",
  initialState: initial_state,
  reducers: {
    set_token : (state,action) => {
        state.token = action.payload
    },
    clear_token : (state) => {
        state.token = null;
    }
  },
});

export const { set_token , clear_token} = TokenSlice.actions; 
export default TokenSlice.reducer;

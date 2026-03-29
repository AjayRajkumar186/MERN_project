import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phoneNumber: "918667626797", // country code included
  defaultMessage: "Hello, I would like to know more",
};

const whatsappSlice = createSlice({
  name: "whatsapp",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.defaultMessage = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
  },
});

export const { setMessage, setPhoneNumber } = whatsappSlice.actions;
export default whatsappSlice.reducer;

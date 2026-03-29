import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isScrollButtonVisible: false,
  },
  reducers: {
    setScrollButtonVisibility: (state, action) => {
      state.isScrollButtonVisible = action.payload;
    },
  },
});

export const { setScrollButtonVisibility } = uiSlice.actions;
export default uiSlice.reducer;
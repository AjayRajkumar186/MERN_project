import { configureStore } from "@reduxjs/toolkit";
import whatsappReducer from "./whatsappSlice";
import uiReducer from "./uiSlice";


export const store = configureStore({
  reducer: {
    whatsapp: whatsappReducer,
    ui: uiReducer,
  },
});

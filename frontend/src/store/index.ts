import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authStore";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

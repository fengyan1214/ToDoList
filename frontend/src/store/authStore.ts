import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload || "");
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sidebarReducer from "./slices/sidebarSlice";

export const store = configureStore({
  reducer: {
    user: userReducer, 
    sidebar: sidebarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

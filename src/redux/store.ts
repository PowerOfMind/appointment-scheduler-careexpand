// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./appointments/appointmentsSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
  },
});

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

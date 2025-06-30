import { configureStore } from "@reduxjs/toolkit";
import { openaiApi } from "./api/openaiApi";

export const store = configureStore({
  reducer: {
    [openaiApi.reducerPath]: openaiApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(openaiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

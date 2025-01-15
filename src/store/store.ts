import { configureStore } from "@reduxjs/toolkit";
import BookingsReducer from "./bookingsReducer";

const store = configureStore({
  reducer: BookingsReducer,
});

export default store;

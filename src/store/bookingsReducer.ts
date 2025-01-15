import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export interface Bookings {
  selectedDate: string;
  selectedDesk?: number;
}

const initialState: Bookings = {
  selectedDate: dayjs().format("YYYY-MM-DD"),
  selectedDesk: undefined,
};

const BookingsSlice = createSlice({
  name: "bookedDesks",
  initialState,
  reducers: {
    selectDesk: (state, action: PayloadAction<{ selectedDesk?: number }>) => {
      state.selectedDesk = action.payload.selectedDesk;
    },
    selectDate: (state, action: PayloadAction<{ selectedDate: string }>) => {
      state.selectedDate = action.payload.selectedDate;
    },
    reset: (state) => {
      state.selectedDesk = initialState.selectedDesk;
      state.selectedDate = initialState.selectedDate;
    },
  },
});

export const { selectDesk, selectDate, reset } = BookingsSlice.actions;
export default BookingsSlice.reducer;

import { Fragment, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import styled from "styled-components";
import "../styles/Calendar.css";
import { useAllMyBookings } from "../services/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking, postBookDesk } from "../services/api";
import { useSelector } from "react-redux";
import { Bookings, selectDate, selectDesk } from "../store/bookingsReducer";
import store from "../store/store";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: dayjs.Dayjs[] },
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected = highlightedDays.find(
    (date) => date.diff(props.day) === 0 && !outsideCurrentMonth,
  );

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "✅" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

const Calendar = () => {
  const selectedDesk = useSelector((state: Bookings) => state.selectedDesk);
  const selectedDate = useSelector((state: Bookings) => state.selectedDate);

  const [date, setDate] = useState<Dayjs>(dayjs(selectedDate));
  const [snackbarMessage, setSnackbarMessage] = useState<
    { message: string; color: string } | undefined
  >();
  const existingBookings = useAllMyBookings().data;
  const highlightedDays = existingBookings?.map((booking) =>
    dayjs(booking.bookingDate),
  );

  const calendarDate = dayjs(selectedDate);

  const existingBooking = existingBookings?.find((booking) => {
    const date = dayjs(booking.bookingDate);
    return (
      date.date() === calendarDate.date() &&
      date.year() === calendarDate.year() &&
      date.month() === calendarDate.month()
    );
  });

  const onChangeDate = (newValue: Dayjs) => {
    setDate(newValue);
    store.dispatch(selectDate({ selectedDate: newValue.format("YYYY-MM-DD") }));
    store.dispatch(selectDesk({ selectedDesk: undefined }));
  };

  const queryClient = useQueryClient();

  const bookDeskMutation = useMutation({
    mutationFn: () => postBookDesk(date.format("YYYY-MM-DD"), selectedDesk),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allMyBookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allBookingsForDate"],
      });
      setSnackbarMessage({
        message: "Desk successfully booked",
        color: "lightGreen",
      });
    },
  });

  const deleteBookingsMutation = useMutation({
    mutationFn: () => deleteBooking(existingBooking?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allMyBookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allBookingsForDate"],
      });
      setSnackbarMessage({
        message: "Booking canceled",
        color: "indianRed",
      });
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbarMessage(undefined);
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateCalendar", "DateCalendar"]}>
          <DateCalendar
            value={date}
            onChange={onChangeDate}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays,
              } as any,
            }}
            minDate={dayjs()}
            sx={{ alignSelf: "end" }}
          />
        </DemoContainer>
      </LocalizationProvider>
      <ButtonContainer>
        <span style={{ flexGrow: 1 }} />
        {!existingBooking && (
          <BookDeskButton
            disabled={selectedDesk === undefined}
            onClick={() => bookDeskMutation.mutate()}
          >
            Book
          </BookDeskButton>
        )}
        {existingBooking && (
          <CancelDeskButton onClick={() => deleteBookingsMutation.mutate()}>
            Cancel Booking
          </CancelDeskButton>
        )}
      </ButtonContainer>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage?.message}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        ContentProps={{
          sx: {
            background: snackbarMessage?.color,
          },
        }}
      />
    </>
  );
};

export default Calendar;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
`;

const BookDeskButton = styled.button`
  width: 200px;
  padding: 10px;
  background-color: #51ac6d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:disabled {
    background-color: lightGray;
  }
`;

const CancelDeskButton = styled.button`
  width: 200px;
  padding: 10px;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

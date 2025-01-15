import MyBookingsTable from "../components/MyBookingsTable";
import { useAllMyBookings } from "../services/queries";
import isToday from "dayjs/plugin/isToday";
import dayjs from "dayjs";

dayjs.extend(isToday);

const MyBookingsPage: React.FC = () => {
  const allMyBookingsQuery = useAllMyBookings();
  const allMyBookings = allMyBookingsQuery.data;

  if (allMyBookingsQuery.isError || !allMyBookings) {
    return <></>;
  }

  const futureBookings = allMyBookings.filter(
    (date) =>
      dayjs(date.bookingDate).isAfter(dayjs()) ||
      dayjs(date.bookingDate).isToday(),
  );
  const pastBookings = allMyBookings.filter(
    (date) =>
      dayjs(date.bookingDate).isBefore(dayjs()) &&
      !dayjs(date.bookingDate).isToday(),
  );

  return (
    <>
      <MyBookingsTable
        title={"Booked Desks"}
        rowsData={futureBookings}
        allowDelete
      />
      <br />
      <MyBookingsTable title={"Past Bookings"} rowsData={pastBookings} />
    </>
  );
};

export default MyBookingsPage;

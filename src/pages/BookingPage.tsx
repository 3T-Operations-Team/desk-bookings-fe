import React from "react";
import DeskLayout from "../components/DeskLayout";
import Calendar from "../components/Calendar";

const BookingPage: React.FC = () => {
  return (
    <>
      <Calendar />
      <DeskLayout />
    </>
  );
};

export default BookingPage;

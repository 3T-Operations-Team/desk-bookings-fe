import { createLazyFileRoute } from "@tanstack/react-router";
import MyBookings from "../pages/MyBookingsPage";

export const Route = createLazyFileRoute("/myBookings")({
  component: MyBookings,
});

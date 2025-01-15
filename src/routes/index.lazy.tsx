import { createLazyFileRoute } from "@tanstack/react-router";
import BookingPage from "../pages/BookingPage";

export const Route = createLazyFileRoute("/")({
  component: BookingPage,
});

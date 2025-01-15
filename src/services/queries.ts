import { useQuery } from "@tanstack/react-query";
import { getAllBookingsForDate, getAllMyBookings, getDeskGroups } from "./api";
import { getStoredUserToken } from "../auth";

export const useDeskGroups = () =>
  useQuery({
    queryKey: ["deskGroups"],
    queryFn: getDeskGroups,
    retry: false,
    enabled: !!getStoredUserToken(),
  });

export const useAllMyBookings = () =>
  useQuery({
    queryKey: ["allMyBookings"],
    queryFn: getAllMyBookings,
    enabled: !!getStoredUserToken(),
  });

export const useAllDateBookings = (date: string) =>
  useQuery({
    queryKey: ["allBookingsForDate", date],
    queryFn: () => getAllBookingsForDate(date),
    enabled: !!getStoredUserToken(),
  });

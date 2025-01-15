import axios from "axios";
import { DeskGroupObject } from "../types/desks";
import { getStoredUserEmail, getStoredUserToken } from "../auth";
import { DeskBookingConfirmed } from "../types/bookings";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = getStoredUserToken();
  return config;
});

export const getDeskGroups = async () => {
  return (await axiosInstance.get<DeskGroupObject[]>("/api/groups")).data;
};

export const getAllMyBookings = async () => {
  return (
    await axiosInstance.get<DeskBookingConfirmed[]>("/api/booking", {
      params: {
        email: getStoredUserEmail(),
      },
    })
  ).data;
};

export const getAllBookingsForDate = async (date: string) => {
  return (
    await axiosInstance.get<DeskBookingConfirmed[]>("/api/booking", {
      params: {
        date,
      },
    })
  ).data;
};

export const deleteBooking = async (id?: string) => {
  if (id === undefined) {
    return;
  }
  await axiosInstance.delete("/api/booking/" + id, {
    params: {
      id,
      email: getStoredUserEmail(),
    },
  });
};

export const postBookDesk = async (date: string, deskId?: number) => {
  if (deskId === undefined) {
    return;
  }
  await axiosInstance.post("/api/booking", {
    params: {
      email: getStoredUserEmail(),
    },
    deskId,
    date,
  });
};

export interface DeskBooking {
  bookingDate: string;
  deskNumber: number;
}

export interface DeskBookingConfirmed extends DeskBooking {
  id: string;
  email: string;
}

export interface MyDeskBookingConfirmed extends DeskBookingConfirmed {
  secret?: string;
}

export type ReservationStatus = "pending" | "active" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "pending";
export type PaymentMethod = "online" | "at_venue";
export type TableType = "normal" | "coupe";

export interface Reservation {
  _id?: string;

  userId?: {
    _id: string;
    fullname: string;
    email: string;
  } | string;

  user: string;
  tableNumber: number;
  tableType: TableType;

  start?: Date | string;
  end?: Date | string;
  date?: string;
  startTime?: string;
  duration?: number;

  status?: ReservationStatus;

  price?: number;

  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  stripeSessionId?: string;

  createdAt?: string;
  updatedAt?: string;
}

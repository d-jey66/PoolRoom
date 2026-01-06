export type ReservationStatus = "pending" | "active" | "completed" | "cancelled";

export interface Reservation {
  _id?: string;
  userId?: {
    _id: string;
    fullname: string;
    email: string;
  } | string; 
  user: string;
  tableNumber: number;
  date?: string; 
  startTime?: string; 
  duration?: number;
  start?: Date | string; 
  end?: Date | string;
  status?: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}
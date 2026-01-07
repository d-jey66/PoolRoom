  /* eslint-disable @typescript-eslint/no-explicit-any */
  
  import axiosInstance from "./axios";
  import type { Reservation } from "../types/reservation";
  import type { User } from "../types/user";
  
  async function handleRequest<T>(request: Promise<any>): Promise<T> {
    try {
      const res = await request;
      return res.data as T;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  }
  
  export const authAPI = {
    signup: (data: { fullname: string; email: string; password: string }) =>
      handleRequest<User>(axiosInstance.post("/auth/signup", data)),
    login: (data: { email: string; password: string }) =>
      handleRequest<User>(axiosInstance.post("/auth/login", data)),
    logout: () => handleRequest<void>(axiosInstance.post("/auth/logout")),
    autoLogin: () => handleRequest<User>(axiosInstance.post("/auth/auto-login")),
  };
  
  export const userAPI = {
    getProfile: () =>
      handleRequest<User>(axiosInstance.get("/users/profile")),
    updateProfile: (data: { fullname: string; email: string }) =>
      handleRequest<User>(axiosInstance.put("/users/update-profile", data)),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      handleRequest<{ status: string; message: string }>(axiosInstance.put("/users/change-password", data)),
    deleteAccount: () =>
      handleRequest<{ status: string; message: string }>(axiosInstance.delete("/users/delete-account")),
  };

  export const reservationAPI = {
    createReservation: (data: Omit<Reservation, "_id">) =>
      handleRequest<Reservation>(axiosInstance.post("/reservations/post", data)),
    getReservations: () =>
      handleRequest<Reservation[]>(axiosInstance.get("/reservations/get")),
    getMyReservations: () =>
      handleRequest<Reservation[]>(axiosInstance.get("/reservations/my-reservations")),
    getReservationById: (id: string) =>
      handleRequest<Reservation>(axiosInstance.get(`/reservations/getById/${id}`)),
    updateReservationStatus: (id: string, status: string) =>
      handleRequest<Reservation>(axiosInstance.put(`/reservations/update/${id}`, { status })),
    deleteReservation: (id: string) =>
      handleRequest<void>(axiosInstance.delete(`/reservations/delete/${id}`)),
  };
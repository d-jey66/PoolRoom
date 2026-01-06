export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  fullname: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

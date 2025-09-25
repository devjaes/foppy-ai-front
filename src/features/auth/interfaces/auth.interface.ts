import { User, UserBase } from "@/features/users/interfaces/user.interface";

export interface Login {
  email: string;
  password: string;
}

export interface Register extends UserBase {
  password: string;
}

export interface AuthResponse extends User {
  token: string;
}

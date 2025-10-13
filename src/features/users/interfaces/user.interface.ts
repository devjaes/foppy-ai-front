export interface UserBase {
  name: string;
  username: string;
  email: string;
}

export interface User extends UserBase {
  id: string;
  registration_date: string;
  active: boolean;
}

export type UserCreate = UserBase & {
  password: string;
};

export type UserUpdateProfile = Partial<
  Pick<UserBase, "name" | "username" | "email">
>;

export interface UserChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfileResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  registration_date: string;
  active: boolean;
}

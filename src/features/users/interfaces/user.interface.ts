export interface UserBase {
  name: string;
  username: string;
  email: string;
}

export interface User extends UserBase {
  id: string;
}

export type UserCreate = UserBase;

export type UserUpdate = Partial<UserBase>;

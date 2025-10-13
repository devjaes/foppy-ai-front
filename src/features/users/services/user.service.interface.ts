import {
  User,
  UserChangePassword,
  UserProfileResponse,
  UserUpdateProfile,
} from "../interfaces/user.interface";

export interface IUserService {
  getUserProfile(id: number): Promise<UserProfileResponse>;
  updateUserProfile(
    id: number,
    data: UserUpdateProfile
  ): Promise<UserProfileResponse>;
  changePassword(id: number, data: UserChangePassword): Promise<void>;
}

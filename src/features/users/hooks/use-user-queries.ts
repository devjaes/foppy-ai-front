import { useMutation, useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "../constants/user-keys";
import { UserService } from "../services/user.datasource";
import {
  UserChangePassword,
  UserUpdateProfile,
} from "../interfaces/user.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { toast } from "sonner";

const userService = UserService.getInstance();

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: USER_KEYS.USER_PROFILE(id),
    queryFn: () => userService.getUserProfile(Number(id)),
    enabled: !!id,
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UserUpdateProfile;
    }) => userService.updateUserProfile(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: USER_KEYS.USER_PROFILE(data.id.toString()),
      });
      toast.success("Perfil actualizado exitosamente");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Error al actualizar el perfil";
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UserChangePassword;
    }) => userService.changePassword(id, data),
    onSuccess: () => {
      toast.success("Contraseña cambiada exitosamente");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Error al cambiar la contraseña";
      toast.error(message);
    },
  });
};

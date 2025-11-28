"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "../services/auth.datasource";
import { Login, Register } from "../interfaces/auth.interface";
import { toast } from "sonner";
import { login } from "../services/actions/login";
import { EmailGender } from "../interfaces/email-gender.interface";
import { Recovery } from "../interfaces/recovery.interface";
import { signOut } from "next-auth/react";

export function useAuthOperations() {
  const authDatasource = AuthService.getInstance();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("callbackUrl");
  const router = useRouter();

  const handleRedirect = () => {
    const path = redirectPath ?? "/management";
    console.log(path);
    window.location.replace(path);
  };

  const loginHandler = async (data: Login) => {
    try {
      const res = await authDatasource.login(data);
      const isLogged = await login(res);

      if (!isLogged.ok) {
        return;
      }

      toast.success(isLogged.message);
      handleRedirect();
    } catch (error) {
      console.error(error);
    }
  };

  const registerHandler = async (data: Register) => {
    try {
      const res = await authDatasource.register(data);
      const isLogged = await login(res);

      if (!isLogged.ok) {
        return;
      }

      toast.success(isLogged.message);
      handleRedirect();
    } catch (error) {
      console.error(error);
    }
  };

  const forgotPasswordHandler = async (data: EmailGender) => {
    try {
      const res = await authDatasource.forgotPassword(data);
      toast.success(res);
      toast.info("Revisa tu correo electrónico para continuar");
    } catch (error) {
      console.error(error);
    }
  };

  const logoutHandler = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const resetPasswordHandler = async (
    data: Omit<Recovery, "resetPasswordToken">
  ) => {
    try {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Token inválido o no proporcionado");
        return;
      }
      const res = await authDatasource.resetPassword({
        ...data,
        resetPasswordToken: token,
      });
      toast.success(res);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loginHandler,
    registerHandler,
    forgotPasswordHandler,
    logoutHandler,
    resetPasswordHandler,
  };
}

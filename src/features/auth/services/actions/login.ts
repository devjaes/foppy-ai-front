"use server";

import { signIn } from "@/auth.config";
import { AuthResponse } from "../../interfaces/auth.interface";

export const login = async (params: AuthResponse) => {
  try {
    await signIn("credentials", {
      id: params.id,
      name: params.name,
      username: params.username,
      email: params.email,
      accessToken: params.token,
      redirect: false,
    });
    return { ok: true, message: "Inicio de sesión exitoso" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Error al iniciar sesión" };
  }
};

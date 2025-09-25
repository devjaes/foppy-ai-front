"use server";
import { signOut } from "@/auth.config";

export const logout = async () => {
  await signOut({ redirect: false });
  window.location.replace("/");
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useAuthOperations } from "./use-auth-operations";
import { Recovery } from "../interfaces/recovery.interface";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener como mínimo 8 carácteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo especial"
      ),
    passwordConfirmation: z
      .string()
      .min(1, "La contraseña de confirmación es requerida"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

type FormFields = z.infer<typeof schema>;

export function useRecoveryForm() {
  const { resetPasswordHandler } = useAuthOperations();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await resetPasswordHandler(data as Omit<Recovery, "resetPasswordToken">);
  };

  return { onSubmit, methods, isSubmiting: methods.formState.isSubmitting };
}

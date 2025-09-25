"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useAuthOperations } from "./use-auth-operations";

const schema = z
  .object({
    password: z.string().min(1, "La contraseña es requerida"),
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
  const { recoveryPasswordHandler } = useAuthOperations();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await recoveryPasswordHandler(data);
  };

  return { onSubmit, methods, isSubmiting: methods.formState.isSubmitting };
}

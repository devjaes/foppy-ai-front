"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useAuthOperations } from "./use-auth-operations";

const schema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El email no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener como mínimo 8 carácteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo especial"
    ),
});

type FormFields = z.infer<typeof schema>;

export function useLoginForm() {
  const { loginHandler } = useAuthOperations();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await loginHandler(data);
  };

  return { onSubmit, methods, isSubmiting: methods.formState.isSubmitting };
}

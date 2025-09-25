"use client";

import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import RHFInput from "@/components/rhf/RHFInput";
import RHFPasswordInput from "@/components/rhf/RHFPasswordInput";
import Link from "next/link";
import { useRegister } from "../../hooks/use-register-form";

const RegisterForm = () => {
  const { methods, onSubmit, isSubmiting } = useRegister();

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col items-center  w-full max-w-xl"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <RHFInput name="name" label="Nombre" placeholder="Nombre" />
          <RHFInput
            name="username"
            label="Nombre de usuario"
            placeholder="Nombre de usuario"
          />
          <RHFInput
            name="email"
            label="Email"
            placeholder="ejemplo@ejemplo.com"
          />
          <RHFPasswordInput
            name="password"
            label="Contraseña"
            placeholder="Contraseña"
          />
          <Button className="my-4" disabled={isSubmiting} type="submit">
            {isSubmiting ? <LoadingSpinner /> : "Registrarse"}
          </Button>
        </form>
        <p className="text-center text-sm">
          Ya tenés una cuenta?
          <Link href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </FormProvider>
    </>
  );
};

export default RegisterForm;

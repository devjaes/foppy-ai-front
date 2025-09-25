"use client";

import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import RHFInput from "@/components/rhf/RHFInput";
import RHFPasswordInput from "@/components/rhf/RHFPasswordInput";
import { useLoginForm } from "../../hooks/use-login-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const LoginForm = () => {
  const { methods, onSubmit, isSubmiting } = useLoginForm();

  const searchParams = useSearchParams();

  const redirectPath = searchParams.get("callbackUrl");
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col items-center  w-full max-w-xl"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <RHFInput
            name="email"
            label="Email"
            placeholder="ejemplo@ejemplo.com"
          />
          <div className="w-full">
            <RHFPasswordInput
              name="password"
              label="Contraseña"
              placeholder="Contraseña"
            />
            <Link
              href="/forgot-password"
              className="text-blue-500 text-sm hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button className="my-4" disabled={isSubmiting} type="submit">
            {isSubmiting ? <LoadingSpinner /> : "Ingresar"}
          </Button>
        </form>
        <p className="text-center text-sm">
          No tienes una cuenta?{" "}
          <Link
            href={
              redirectPath
                ? `/register?callbackUrl=${redirectPath}`
                : "/register"
            }
            className="text-blue-500 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </FormProvider>
    </>
  );
};

export default LoginForm;

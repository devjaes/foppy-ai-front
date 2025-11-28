"use client";

import { FormProvider } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRecoveryForm } from "../../hooks/use-recovery-form";
import RHFPasswordInput from "@/components/rhf/RHFPasswordInput";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RecoveryForm = () => {
  const { methods, onSubmit, isSubmiting } = useRecoveryForm();

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col items-center  w-full max-w-xl"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <RHFPasswordInput name="password" label="Contraseña" />
          <RHFPasswordInput
            name="passwordConfirmation"
            label="Confirmar contraseña"
          />
          <div className="mt-4">
            <Link
              href="/login"
              className={cn([
                buttonVariants({ variant: "link" }),
                "text-blue-500",
              ])}
            >
              Inicia sesión
            </Link>
            <Button disabled={isSubmiting} type="submit">
              {isSubmiting ? <LoadingSpinner /> : "Restablecer contraseña"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default RecoveryForm;

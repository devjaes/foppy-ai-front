"use client";

import { FormProvider } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import RHFInput from "@/components/rhf/RHFInput";
import { useEmailGenderForm } from "../../hooks/use-email-gender-form";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EmailGenderForm = () => {
  const { methods, onSubmit, isSubmiting } = useEmailGenderForm();

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col items-center w-full max-w-xl mt-4"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <RHFInput name="email" label="Email" />
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
              {isSubmiting ? <LoadingSpinner /> : "Enviar email"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default EmailGenderForm;

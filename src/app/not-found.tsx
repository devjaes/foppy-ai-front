"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  ">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-red-600 dark:text-red-400">
          404
        </h1>
        <h2 className="mb-8 text-3xl font-semibold">Página no encontrada</h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>
          <Button
            asChild
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

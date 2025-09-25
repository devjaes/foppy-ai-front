import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="footer" className="container px-4">
      <Separator />
      <div className="p-10 ">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex items-center font-bold gap-4">
              <Image
                src="/images/logo.png"
                alt="FoppyAI logo"
                className="rounded-full"
                width={170}
                priority
                height={170}
              />
              <div>
                <h3 className="text-2xl">FoppyAI</h3>
                <p>
                  Gestiona tus rentas de automóvil con FoppyAI de forma rápida y
                  segura.
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contacto</h3>
            <div>
              <Link
                href="mailto:contact@FoppyAI.com"
                className="opacity-60 hover:opacity-100"
              >
                Email
              </Link>
            </div>
            <div>
              <Link
                href="tel:+123456789"
                className="opacity-60 hover:opacity-100"
              >
                Teléfono
              </Link>
            </div>
            <div>
              <Link
                href="https://www.google.com/maps"
                target="_blank"
                className="opacity-60 hover:opacity-100"
              >
                Ubicación
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Servicios</h3>
            <div>
              <Link href="/rent" className="opacity-60 hover:opacity-100">
                Rentar un vehículo
              </Link>
            </div>
            <div>
              <Link href="/offers" className="opacity-60 hover:opacity-100">
                Ofertas especiales
              </Link>
            </div>
            <div>
              <Link href="/corporate" className="opacity-60 hover:opacity-100">
                Planes corporativos
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Soporte</h3>
            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                Contáctanos
              </Link>
            </div>
            <div>
              <Link href="/faq" className="opacity-60 hover:opacity-100">
                Preguntas frecuentes
              </Link>
            </div>
            <div>
              <Link href="/support" className="opacity-60 hover:opacity-100">
                Soporte técnico
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Redes Sociales</h3>
            <div>
              <Link
                href="https://facebook.com/FoppyAI"
                target="_blank"
                className="opacity-60 hover:opacity-100"
              >
                Facebook
              </Link>
            </div>
            <div>
              <Link
                href="https://twitter.com/FoppyAI"
                target="_blank"
                className="opacity-60 hover:opacity-100"
              >
                Twitter
              </Link>
            </div>
            <div>
              <Link
                href="https://instagram.com/FoppyAI"
                target="_blank"
                className="opacity-60 hover:opacity-100"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>

        <section className="text-center mt-6">
          <h3 className="text-sm">
            &copy; 2024 FoppyAI. Diseñado y desarrollado por FoppyAI S.A
          </h3>
        </section>
      </div>
    </footer>
  );
};

export default Footer;

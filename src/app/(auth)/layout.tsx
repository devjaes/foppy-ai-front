import { auth } from "@/auth.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) {
    redirect("/management");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  p-8">
      <Card className="w-full md:max-w-md">
        <CardHeader>
          <Link href="/" className="flex flex-col items-center justify-between">
            <Image
              priority
              src="/images/logo.png"
              alt="FoppyAI logo"
              width={170}
              height={170}
            />
            <CardTitle className="text-2xl">FinancyApp</CardTitle>
            <CardDescription>
              Gestiona tus finanzas de forma sencilla
            </CardDescription>
          </Link>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

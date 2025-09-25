import { auth } from "@/auth.config";
import DashboardPanelLayout from "@/core/layout/content/dashboard-layout";
import { redirect } from "next/navigation";

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await auth();
  if (!sesion?.user) redirect("/login");

  return <DashboardPanelLayout>{children}</DashboardPanelLayout>;
}

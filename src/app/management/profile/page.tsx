import { auth } from "@/auth.config";
import { ContentLayout } from "@/core/layout/content/content-layout";
import { ProfileView } from "@/features/users/presentation/views/profile-view";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <ContentLayout title="Mi Perfil">
      <div className="w-full">
        <ProfileView userId={session.user.id} />
      </div>
    </ContentLayout>
  );
}

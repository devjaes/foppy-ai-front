"use client";

import { useUserProfile } from "../../hooks/use-user-queries";
import { ProfileForm } from "../components/profile-form";
import { ChangePasswordForm } from "../components/change-password-form";
import { ProfileInfoCard } from "../components/profile-info-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProfileViewProps {
  userId: string;
}

export function ProfileView({ userId }: ProfileViewProps) {
  const { data: user, isLoading, error } = useUserProfile(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudo cargar el perfil de usuario. Por favor, intenta nuevamente
          más tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <ProfileForm user={user} />
      <ChangePasswordForm userId={user.id} />
      <ProfileInfoCard user={user} />
    </div>
  );
}

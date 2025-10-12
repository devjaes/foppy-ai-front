"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserProfileResponse } from "../../interfaces/user.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ProfileInfoCardProps {
  user: UserProfileResponse;
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Cuenta</CardTitle>
        <CardDescription>
          Consulta los detalles de tu cuenta e información de registro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              ID de Usuario
            </p>
            <p className="text-sm">{user.id}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Fecha de Registro
            </p>
            <p className="text-sm">
              {format(new Date(user.registration_date), "PPP", { locale: es })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Estado de Cuenta
            </p>
            <div className="mt-1">
              <Badge variant={user.active ? "default" : "destructive"}>
                {user.active ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

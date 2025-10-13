# FoppyAI Frontend - Documentación Completa

## Índice
1. [Información General](#información-general)
2. [Arquitectura del Frontend](#arquitectura-del-frontend)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Características Implementadas](#características-implementadas)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [Gestión de Estado](#gestión-de-estado)
8. [Componentes Principales](#componentes-principales)
9. [Integración con Backend](#integración-con-backend)
10. [Rutas y Navegación](#rutas-y-navegación)
11. [Features por Módulo](#features-por-módulo)
12. [Configuración y Deployment](#configuración-y-deployment)

---

## 1. Información General

### Descripción
Frontend de FoppyAI construido con Next.js 14, utilizando App Router y Server Components. Implementa una arquitectura limpia con separación de responsabilidades y componentes reutilizables.

### Ubicación del Proyecto
- **Path**: `/Users/jair/devProjects/fopyments-app`
- **Puerto de Desarrollo**: 3001
- **Puerto de Producción**: 3001

---

## 2. Arquitectura del Frontend

### Patrón Arquitectónico
El frontend sigue una **Arquitectura en Capas Limpia** con separación clara entre:
- **Presentación**: Componentes UI y páginas
- **Lógica de Negocio**: Hooks y servicios
- **Infraestructura**: Clientes HTTP, configuración

### Principios Aplicados
- **Separation of Concerns**: Cada módulo tiene su responsabilidad específica
- **DRY (Don't Repeat Yourself)**: Componentes y hooks reutilizables
- **Single Responsibility**: Cada componente/hook tiene una única responsabilidad
- **Composition over Inheritance**: Uso de composición de componentes

---

## 3. Stack Tecnológico

### Core Framework
- **Next.js**: 14.2.15 (App Router)
- **React**: 18 (con Server Components)
- **TypeScript**: 5

### UI y Estilos
- **Tailwind CSS**: 3.4.1
- **shadcn/ui**: Componentes basados en Radix UI
- **Radix UI**: Primitivos accesibles (@radix-ui/*)
- **Lucide React**: 0.503.0 (Iconos)
- **class-variance-authority**: 0.7.0 (Variantes de componentes)
- **tailwind-merge**: 2.5.3 (Merge de clases Tailwind)
- **tailwindcss-animate**: 1.0.7 (Animaciones)
- **next-themes**: 0.3.0 (Tema claro/oscuro)

### Gestión de Estado y Data Fetching
- **TanStack Query** (React Query): 5.59.16
  - Cliente de data fetching
  - Caché automático
  - Devtools incluidas
- **Zustand**: 5.0.0-rc.2 (Estado global ligero)
- **Next-Auth**: 5.0.0-beta.22 (Autenticación)

### Comunicación HTTP
- **Axios**: 1.7.7 (Cliente HTTP)
- **Socket.IO Client**: 4.7.5 (WebSocket para notificaciones)

### Formularios y Validación
- **React Hook Form**: 7.53.0
- **Zod**: 3.23.8 (Validación de esquemas)
- **@hookform/resolvers**: 3.9.0 (Integración Zod con RHF)

### Utilidades
- **date-fns**: 3.6.0 (Manipulación de fechas)
- **jwt-decode**: 4.0.0 (Decodificación JWT)
- **camelcase-keys**: 9.1.3 (Conversión de claves)
- **snakecase-keys**: 8.0.1 (Conversión de claves)
- **file-saver**: 2.0.5 (Descarga de archivos)
- **cmdk**: 1.0.0 (Command palette)
- **sonner**: 1.5.0 (Toast notifications)

### Audio y Multimedia
- **extendable-media-recorder**: 9.2.23
- **extendable-media-recorder-wav-encoder**: 7.0.127
- **lamejs**: 1.2.1 (Codificación MP3)

### Testing
- **Jest**: 29.7.0
- **@testing-library/react**: 16.1.0
- **@testing-library/jest-dom**: 6.6.2
- **@testing-library/user-event**: 14.5.2
- **MSW**: 2.5.2 (Mock Service Worker)

### DevTools
- **ESLint**: 8 (con eslint-config-next)
- **PostCSS**: 8
- **Sharp**: 0.33.5 (Optimización de imágenes)

---

## 4. Estructura de Directorios

```
fopyments-app/
├── public/                     # Archivos estáticos
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Grupo de rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── 403/                # Página de acceso denegado
│   │   ├── api/                # API Routes
│   │   ├── management/         # Dashboard y módulos principales
│   │   │   ├── budgets/
│   │   │   ├── debts/
│   │   │   ├── goals/
│   │   │   ├── payment-methods/
│   │   │   ├── reports/
│   │   │   ├── transactions/
│   │   │   ├── layout.tsx      # Layout protegido
│   │   │   └── page.tsx        # Dashboard principal
│   │   ├── globals.css         # Estilos globales
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # Página 404
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/             # Componentes UI reutilizables (shadcn/ui)
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── toast.tsx
│   │       └── ... (30+ componentes)
│   │
│   ├── core/                   # Core del sistema
│   │   ├── hooks/              # Hooks globales
│   │   ├── infrastructure/     # Configuración de infraestructura
│   │   │   ├── http/
│   │   │   │   └── axios-client.ts
│   │   │   └── react-query/
│   │   │       └── query-client.ts
│   │   ├── layout/             # Layouts principales
│   │   │   ├── content/
│   │   │   ├── dashboard/
│   │   │   │   ├── footer/
│   │   │   │   ├── navbar/
│   │   │   │   └── sidebar/
│   │   │   └── landing-page/
│   │   ├── providers/          # Context Providers
│   │   │   ├── auth.provider.tsx
│   │   │   ├── notifications.provider.tsx
│   │   │   ├── socketio.provider.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── toast.provider.tsx
│   │   └── services/           # Servicios core
│   │
│   ├── features/               # Módulos por feature
│   │   ├── audio/
│   │   │   ├── components/
│   │   │   │   ├── audio-capture-modal.tsx
│   │   │   │   └── audio-recorder.tsx
│   │   │   └── services/
│   │   │       └── audio.service.ts
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   ├── interfaces/
│   │   │   ├── presentation/
│   │   │   └── services/
│   │   ├── budgets/
│   │   │   ├── hooks/
│   │   │   ├── interfaces/
│   │   │   ├── presentation/
│   │   │   └── services/
│   │   ├── categories/
│   │   ├── debts/
│   │   ├── email/
│   │   ├── goals/
│   │   ├── notifications/
│   │   ├── payment-methods/
│   │   ├── reports/
│   │   ├── transactions/
│   │   └── users/
│   │
│   ├── hooks/                  # Hooks compartidos
│   ├── lib/                    # Utilidades y helpers
│   │   ├── format-currency.ts
│   │   ├── format-date.ts
│   │   ├── get-errors.ts
│   │   ├── menu-list.ts
│   │   └── utils.ts
│   ├── shared/                 # Código compartido
│   ├── types/                  # Tipos TypeScript globales
│   ├── auth.config.ts          # Configuración NextAuth
│   └── middleware.ts           # Middleware de Next.js
│
├── .env                        # Variables de entorno
├── .eslintrc.json             # Configuración ESLint
├── components.json            # Configuración shadcn/ui
├── jest.config.ts             # Configuración Jest
├── jest.setup.ts              # Setup de Jest
├── next.config.mjs            # Configuración Next.js
├── package.json               # Dependencias
├── postcss.config.mjs         # Configuración PostCSS
├── tailwind.config.ts         # Configuración Tailwind
└── tsconfig.json              # Configuración TypeScript
```

---

## 5. Características Implementadas

### 5.1 Características Principales

#### Dashboard Financiero
- **Ubicación**: `/app/management/page.tsx`
- **Resumen financiero mensual**:
  - Total de ingresos
  - Total de gastos
  - Balance neto
- **Vista de metas financieras** con barras de progreso
- **Vista de presupuestos** con indicadores de consumo
- **Vista de deudas** con seguimiento de pagos
- **Gastos por categoría** (pendiente de implementación completa)
- **Acciones rápidas**: Enlaces a creación de transacciones, metas, presupuestos y deudas

#### Sistema de Notificaciones en Tiempo Real
- **Provider**: `NotificationProvider`
- **Polling**: Cada 30 segundos
- **Toast notifications** según tipo:
  - WARNING: Advertencias (toast.warning)
  - SUGGESTION: Sugerencias (toast.info)
  - CONGRATULATION: Felicitaciones (toast.success)
  - DEFAULT: Información general
- **Funcionalidades**:
  - Marcar como leída
  - Marcar todas como leídas
  - Refresh manual
  - Contador de no leídas

#### Comando de Voz (IA)
- **Ubicación**: `features/audio`
- **Grabación de audio** en formato WAV
- **Envío al backend** para procesamiento
- **Análisis de intención**:
  - CREATE_TRANSACTION
  - CREATE_GOAL
  - CREATE_BUDGET
- **Auto-llenado de formularios** con datos extraídos
- **Confirmación manual** antes de crear entidad

#### Temas Claro/Oscuro
- **Provider**: `ThemeProvider` con next-themes
- **Sistema**: Respeta preferencias del sistema operativo
- **Persistencia**: Guardado en localStorage
- **Toggle**: Disponible en navbar

### 5.2 Módulos CRUD Completos

#### Transacciones
- Listar transacciones con filtros
- Crear ingreso/gasto
- Editar transacción
- Eliminar transacción
- Filtros por fecha, categoría, tipo
- Vinculación con presupuestos y metas

#### Metas de Ahorro
- Listar metas
- Crear meta con contribución automática
- Editar meta
- Eliminar meta
- Ver contribuciones
- Agregar contribución manual
- Barra de progreso visual

#### Presupuestos
- Listar presupuestos mensuales
- Crear presupuesto por categoría
- Editar presupuesto
- Eliminar presupuesto
- Indicador de consumo vs límite
- Alertas de exceso

#### Deudas
- Listar deudas
- Crear deuda
- Editar deuda
- Eliminar deuda
- Registrar pagos parciales
- Seguimiento de saldo pendiente

#### Métodos de Pago
- Listar métodos de pago
- Crear método (efectivo, tarjeta, etc.)
- Editar método
- Eliminar método
- Compartir con otros usuarios

#### Reportes
- Generar reportes financieros
- Tipos: Metas, Presupuestos, Gastos, Ingresos
- Formatos: JSON, PDF, Excel, CSV
- Descarga automática
- Filtros avanzados

---

## 6. Sistema de Autenticación

### NextAuth v5 (Beta)

**Archivo de Configuración**: `src/auth.config.ts`

#### Provider: Credentials
```typescript
CredentialsProvider({
  credentials: {
    id, name, username, email, accessToken
  },
  authorize: (credentials) => {
    // Validación con Zod
    // Retorna usuario si válido
  }
})
```

#### Callbacks
```typescript
jwt: ({ token, user }) => {
  // Guarda datos del usuario en el token
  token.id = user.id;
  token.accessToken = user.accessToken;
  // ...
}

session: ({ session, token }) => {
  // Transfiere datos del token a la sesión
  session.user.id = token.id;
  session.user.accessToken = token.accessToken;
  // ...
}
```

### Middleware de Autenticación

**Archivo**: `src/middleware.ts`

```typescript
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
```

**Rutas Protegidas**:
- `/management/*` - Requiere autenticación
- Redirección automática a `/login` si no autenticado

**Rutas Públicas**:
- `/login`
- `/register`
- `/` (landing page)
- Archivos estáticos

### Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. POST a backend /auth/login
   ↓
3. Backend valida y retorna JWT + datos de usuario
   ↓
4. Frontend llama signIn() de NextAuth
   ↓
5. NextAuth guarda en sesión (cookie segura)
   ↓
6. Redirect a /management
   ↓
7. Middleware verifica sesión en cada navegación
```

### Uso en Componentes

#### Client Components
```typescript
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
const userId = session?.user?.id;
const token = session?.user?.accessToken;
```

#### Server Components
```typescript
import { auth } from "@/auth.config";

const session = await auth();
if (!session?.user) redirect("/login");
```

### Logout
```typescript
import { signOut } from "next-auth/react";

const handleLogout = () => {
  signOut({ callbackUrl: "/login" });
};
```

---

## 7. Gestión de Estado

### 7.1 TanStack Query (React Query)

**Configuración**: `src/core/infrastructure/react-query/query-client.ts`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,      // 1 minuto
      cacheTime: 5 * 60 * 1000,  // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

#### Características
- **Caché automático** de datos del servidor
- **Refetch** en background
- **Optimistic updates**
- **Invalidación de queries**
- **DevTools** incluidas

#### Ejemplo de Uso (Queries)
```typescript
// Hook personalizado
export const useMonthlyBalance = (userId: string, month: string) => {
  return useQuery({
    queryKey: ["monthly-balance", userId, month],
    queryFn: () => transactionService.getMonthlyBalance(userId, month),
    enabled: !!userId,
  });
};

// En componente
const { data, isLoading, error } = useMonthlyBalance(userId, currentMonth);
```

#### Ejemplo de Uso (Mutations)
```typescript
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTransactionDTO) => 
      transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transacción creada");
    },
  });
};
```

### 7.2 Zustand (Estado Global Ligero)

Utilizado para estado UI temporal y preferencias:
- Tema claro/oscuro
- Estado del sidebar (abierto/cerrado)
- Filtros de búsqueda

### 7.3 Context API

#### NotificationContext
**Provider**: `NotificationProvider`

```typescript
interface NotificationContextType {
  notifications: INotification[];
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
}
```

**Uso**:
```typescript
const { notifications, markAsRead } = useNotifications();
```

#### AuthProvider
Wrapper de NextAuth con SessionProvider.

---

## 8. Componentes Principales

### 8.1 Layouts

#### DashboardPanelLayout
**Ubicación**: `src/core/layout/content/dashboard-layout`

Componentes:
- **Sidebar**: Navegación lateral con íconos
- **Navbar**: Barra superior con usuario y notificaciones
- **Footer**: Información del pie de página
- **ContentLayout**: Contenedor de contenido con breadcrumbs

#### Características del Sidebar
- **Colapsable**: Puede minimizarse
- **Responsive**: Se convierte en drawer en móvil
- **Indicador de ruta activa**
- **Tooltips** en modo colapsado

### 8.2 Componentes UI (shadcn/ui)

Basados en Radix UI con Tailwind CSS:

#### Formularios
- `Form`: Wrapper de React Hook Form
- `Input`: Campo de texto
- `Select`: Selector desplegable
- `Checkbox`: Casilla de verificación
- `RadioGroup`: Grupo de radio buttons
- `Switch`: Interruptor
- `Textarea`: Área de texto
- `DatePicker`: Selector de fechas (react-day-picker)

#### Feedback
- `Toast` (Sonner): Notificaciones temporales
- `Alert`: Alertas estáticas
- `Progress`: Barra de progreso
- `LoadingSpinner`: Indicador de carga
- `Skeleton`: Placeholder de carga

#### Navegación
- `Button`: Botón con variantes
- `DropdownMenu`: Menú desplegable
- `NavigationMenu`: Menú de navegación
- `Tabs`: Pestañas
- `Breadcrumb`: Migas de pan

#### Overlays
- `Dialog`: Modal
- `AlertDialog`: Modal de confirmación
- `Popover`: Popover
- `Tooltip`: Tooltip
- `Sheet`: Panel lateral

#### Data Display
- `Card`: Tarjeta
- `Table`: Tabla de datos
- `Avatar`: Avatar de usuario
- `Badge`: Etiqueta
- `Separator`: Separador

### 8.3 Componentes de Feature

#### AudioRecorder
**Ubicación**: `features/audio/components/audio-recorder.tsx`

- Grabación de audio
- Visualización de forma de onda
- Controles de grabación/pausa/stop
- Envío al backend

#### TransactionForm
**Ubicación**: `features/transactions/presentation/components/transaction-form.tsx`

- Formulario de creación/edición
- Validación con Zod
- Auto-llenado desde comando de voz
- Selección de categoría y método de pago

#### GoalCard
**Ubicación**: `features/goals/presentation/components/goal-card.tsx`

- Tarjeta de meta
- Barra de progreso
- Acciones (editar, eliminar, contribuir)

---

## 9. Integración con Backend

### 9.1 Axios Client

**Ubicación**: `src/core/infrastructure/http/axios-client.ts`

#### Características
- **Singleton Pattern**: Una única instancia
- **Interceptors**:
  - Request: Agrega token JWT automáticamente
  - Response: Manejo global de errores con toast
- **Base URL**: Configurable vía env variable
- **Tipos genéricos** para respuestas

#### Configuración
```typescript
class AxiosClient {
  private static readonly baseUrl: string =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://car-rental-latest-sjbv.onrender.com";

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session) {
          config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }
        return config;
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        toast.error(error?.response?.data?.message);
        return Promise.reject(error);
      }
    );
  }
}
```

#### Uso en Servicios
```typescript
export class TransactionService {
  private axiosClient: AxiosClient;

  constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  async getAll(userId: string): Promise<Transaction[]> {
    const response = await this.axiosClient.get<Transaction[]>(
      `/transactions?userId=${userId}`
    );
    return response.data.data;
  }
}
```

### 9.2 Estructura de Respuestas API

```typescript
interface ResponseAPI<T> {
  status?: string;
  success: boolean;
  message: string;
  data: T;
  errors: string[] | string | null;
}
```

### 9.3 Transformación de Datos

#### camelCase ↔ snake_case
```typescript
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

// Backend envía snake_case
const backendData = { user_id: 1, created_at: "..." };

// Frontend usa camelCase
const frontendData = camelcaseKeys(backendData, { deep: true });
// { userId: 1, createdAt: "..." }

// Al enviar al backend
const payload = snakecaseKeys(frontendData, { deep: true });
```

### 9.4 Servicios por Feature

Cada feature tiene su propio servicio:

```typescript
// features/transactions/services/transaction.service.ts
export class TransactionService {
  private static instance: TransactionService;
  private axiosClient: AxiosClient;

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  async create(data: CreateTransactionDTO): Promise<Transaction> {...}
  async update(id: string, data: UpdateTransactionDTO): Promise<Transaction> {...}
  async delete(id: string): Promise<void> {...}
  async getAll(userId: string): Promise<Transaction[]> {...}
  async getById(id: string): Promise<Transaction> {...}
}
```

### 9.5 WebSocket para Notificaciones

**Provider**: `SocketIOProvider`

```typescript
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  auth: {
    token: session?.user?.accessToken,
  },
  transports: ['websocket'],
});

socket.on('notification', (notification) => {
  // Mostrar toast
  // Actualizar lista de notificaciones
});
```

---

## 10. Rutas y Navegación

### 10.1 Estructura de Rutas (App Router)

```
/                               # Landing page (público)
/login                          # Página de login
/register                       # Página de registro
/403                            # Acceso denegado
/management                     # Dashboard (protegido)
/management/goals               # Lista de metas
/management/goals/create        # Crear meta
/management/goals/[id]          # Detalle de meta
/management/goals/[id]/edit     # Editar meta
/management/budgets             # Lista de presupuestos
/management/budgets/create      # Crear presupuesto
/management/budgets/[id]/edit   # Editar presupuesto
/management/debts               # Lista de deudas
/management/debts/create        # Crear deuda
/management/debts/[id]/edit     # Editar deuda
/management/transactions        # Lista de transacciones
/management/transactions/create # Crear transacción
/management/transactions/[id]/edit # Editar transacción
/management/payment-methods     # Lista de métodos de pago
/management/payment-methods/create # Crear método
/management/payment-methods/[id]/edit # Editar método
/management/reports             # Lista de reportes
/management/reports/create      # Generar reporte
```

### 10.2 Grupos de Rutas

#### (auth) - Rutas de Autenticación
Layout especial sin sidebar/navbar:
```
app/
  (auth)/
    login/
      page.tsx
    register/
      page.tsx
    layout.tsx  # Layout sin dashboard
```

#### management - Rutas Protegidas
Layout con dashboard completo:
```typescript
// app/management/layout.tsx
export default async function DemoLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  return <DashboardPanelLayout>{children}</DashboardPanelLayout>;
}
```

### 10.3 Menú de Navegación

**Archivo**: `src/lib/menu-list.ts`

```typescript
const allMenus: Group[] = [
  {
    groupLabel: "Módulos",
    menus: [
      {
        href: "/management",
        label: "Dashboard",
        icon: LayoutDashboard,
        active: pathname === "/management",
        submenus: [],
      },
      {
        href: "/management/goals",
        label: "Metas",
        icon: Target,
        active: pathname.startsWith("/management/goals"),
        submenus: [],
      },
      {
        href: "/management/budgets",
        label: "Presupuestos",
        icon: HandCoins,
        submenus: [],
      },
      {
        href: "/management/debts",
        label: "Deudas",
        icon: BanknoteArrowDown,
        submenus: [],
      },
      {
        href: "/management/payment-methods",
        label: "Métodos de Pago",
        icon: CreditCard,
        submenus: [],
      },
      {
        href: "/management/transactions",
        label: "Transacciones",
        icon: ArrowLeftRight,
        submenus: [],
      },
    ],
  },
];
```

### 10.4 Navegación Programática

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();

// Navegar
router.push("/management/goals");

// Navegar y reemplazar historial
router.replace("/management");

// Volver atrás
router.back();

// Refrescar datos del servidor
router.refresh();
```

---

## 11. Features por Módulo

### 11.1 Transacciones

**Ubicación**: `src/features/transactions`

#### Interfaces
```typescript
interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId?: number;
  description?: string;
  paymentMethodId?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Hooks Principales
```typescript
// Queries
useTransactions(userId: string)
useTransaction(id: string)
useMonthlyBalance(userId: string, month: string)
useTransactionsByCategory(userId: string, startDate: Date, endDate: Date)

// Mutations
useCreateTransaction()
useUpdateTransaction()
useDeleteTransaction()
```

#### Componentes
- `TransactionList`: Tabla de transacciones
- `TransactionForm`: Formulario de crear/editar
- `TransactionFilters`: Filtros de búsqueda
- `TransactionCard`: Tarjeta de transacción (móvil)

### 11.2 Metas de Ahorro

**Ubicación**: `src/features/goals`

#### Interfaces
```typescript
interface Goal {
  id: number;
  userId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  endDate: Date;
  contributionFrequency: number; // días
  contributionAmount: number;
  categoryId?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GoalContribution {
  id: number;
  goalId: number;
  amount: number;
  date: Date;
  transactionId?: number;
}
```

#### Hooks Principales
```typescript
// Queries
useFindGoalUsersById(userId: string)
useGoal(id: string)
useGoalContributions(goalId: string)

// Mutations
useCreateGoal()
useUpdateGoal()
useDeleteGoal()
useCreateContribution()
```

#### Componentes
- `GoalList`: Lista de metas con progreso
- `GoalForm`: Formulario de creación/edición
- `GoalCard`: Tarjeta con barra de progreso
- `GoalContributionForm`: Formulario de contribución
- `ContributionHistory`: Historial de contribuciones

### 11.3 Presupuestos

**Ubicación**: `src/features/budgets`

#### Interfaces
```typescript
interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  limitAmount: number;
  currentAmount: number;
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  month: string; // YYYY-MM
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}
```

#### Hooks Principales
```typescript
// Queries
useFindMonthlyBudgets(userId: string, month: string)
useBudget(id: string)

// Mutations
useCreateBudget()
useUpdateBudget()
useDeleteBudget()
```

#### Componentes
- `BudgetList`: Lista de presupuestos
- `BudgetForm`: Formulario
- `BudgetCard`: Tarjeta con indicador de consumo
- `BudgetProgress`: Barra de progreso con colores

### 11.4 Deudas

**Ubicación**: `src/features/debts`

#### Interfaces
```typescript
interface Debt {
  id: number;
  userId: number;
  description: string;
  originalAmount: number;
  pendingAmount: number;
  interestRate?: number;
  dueDate: Date;
  status: 'ACTIVE' | 'PAID' | 'OVERDUE';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Hooks Principales
```typescript
// Queries
useFindDebtUserById(userId: string)
useDebt(id: string)

// Mutations
useCreateDebt()
useUpdateDebt()
useDeleteDebt()
usePayDebt()
```

#### Componentes
- `DebtList`: Lista de deudas
- `DebtForm`: Formulario
- `DebtCard`: Tarjeta con progreso de pago
- `PaymentForm`: Formulario de pago parcial

### 11.5 Reportes

**Ubicación**: `src/features/reports`

#### Interfaces
```typescript
interface Report {
  id: string;
  userId: number;
  type: ReportType;
  format: ReportFormat;
  filters: ReportFilters;
  createdAt: Date;
  expiresAt: Date;
}

enum ReportType {
  GOAL = "GOAL",
  BUDGET = "BUDGET",
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  SAVINGS_SUMMARY = "SAVINGS_SUMMARY",
}

enum ReportFormat {
  JSON = "JSON",
  PDF = "PDF",
  EXCEL = "EXCEL",
  CSV = "CSV",
}
```

#### Hooks Principales
```typescript
// Mutations
useGenerateReport()
useDeleteReport()
```

#### Componentes
- `ReportGenerator`: Formulario de generación
- `ReportFilters`: Filtros avanzados
- `ReportPreview`: Vista previa (JSON)
- `ReportDownloadButton`: Botón de descarga

### 11.6 Comandos de Voz (Audio)

**Ubicación**: `src/features/audio`

#### Servicios
```typescript
class AudioService {
  async sendAudio(audioBlob: Blob): Promise<AudioResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
    
    const response = await this.axiosClient.postForm('/voice-command', formData);
    
    return {
      transcription: response.data.message,
      formData: this.mapToFormData(response.data)
    };
  }
  
  private mapToFormData(data: any): FormData {
    // Mapea extractedData según intent
    // CREATE_TRANSACTION → path: /transactions/create
    // CREATE_GOAL → path: /goals/create
    // CREATE_BUDGET → path: /budgets/create
  }
}
```

#### Componentes
- `AudioCaptureModal`: Modal de grabación
- `AudioRecorder`: Interfaz de grabación
- `WaveformVisualizer`: Visualización de onda

#### Flujo de Uso
1. Usuario abre modal de grabación
2. Graba comando de voz
3. Envía audio al backend
4. Backend retorna intent y datos extraídos
5. Frontend redirige a formulario correspondiente
6. Formulario se auto-llena con datos
7. Usuario confirma o edita
8. Crea la entidad

---

## 12. Configuración y Deployment

### 12.1 Variables de Entorno

**Archivo**: `.env`

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_key_here

# Otros
NODE_ENV=development
```

### 12.2 Scripts Disponibles

```json
{
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "next lint",
  "test": "jest"
}
```

### 12.3 Configuración de Next.js

**Archivo**: `next.config.mjs`

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};
```

### 12.4 Configuración de TypeScript

**Archivo**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["jest", "node"]
  }
}
```

### 12.5 Configuración de shadcn/ui

**Archivo**: `components.json`

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 12.6 Testing

**Configuración**: `jest.config.ts`

```typescript
const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};
```

**Setup**: `jest.setup.ts`

```typescript
import '@testing-library/jest-dom';
```

### 12.7 Docker

**Archivo**: `Dockerfile`

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
CMD ["node", "server.js"]
```

### 12.8 Deployment a Producción

#### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Variables de Entorno en Vercel
```
NEXT_PUBLIC_API_URL=https://api.foppyai.com
NEXTAUTH_URL=https://foppyai.com
NEXTAUTH_SECRET=production_secret_key
```

#### Build Manual
```bash
npm run build
npm run start
```

---

## 13. Buenas Prácticas Implementadas

### 13.1 Código

#### Tipado Fuerte
```typescript
// ✅ Bueno
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = await fetchUser();

// ❌ Malo
const user: any = await fetchUser();
```

#### Composición de Componentes
```typescript
// ✅ Bueno - Componentes pequeños y reutilizables
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>

// ❌ Malo - Componente monolítico
<MegaCard title="..." content="..." footer="..." />
```

#### Custom Hooks
```typescript
// ✅ Bueno - Lógica reutilizable
function useTransactions(userId: string) {
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => fetchTransactions(userId),
  });
}

// ❌ Malo - Lógica duplicada en componentes
```

### 13.2 Performance

#### Server Components por Defecto
```typescript
// app/management/page.tsx - Server Component
export default async function Page() {
  const data = await fetchData(); // Fetch en servidor
  return <ClientComponent data={data} />;
}
```

#### Client Components Solo Cuando Necesario
```typescript
// Necesita interactividad
"use client";
export function InteractiveForm() {
  const [state, setState] = useState();
  return <form>...</form>;
}
```

#### Lazy Loading
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### 13.3 Accesibilidad

- **Semántica HTML** correcta
- **ARIA labels** en componentes interactivos
- **Keyboard navigation** funcional
- **Focus management** apropiado
- **Contraste de colores** adecuado

### 13.4 SEO

```typescript
// Metadata en cada página
export const metadata: Metadata = {
  title: "Dashboard - FoppyAI",
  description: "Gestiona tus finanzas personales",
};
```

---

## 14. Problemas Conocidos y Soluciones

### 14.1 Bug: Categoría "Otros" Falla

**Problema**: Al seleccionar la categoría "Otros" en transacciones, el formulario falla.

**Posible Causa**:
- La categoría "Otros" no existe en la BD
- ID incorrecto en el componente Select
- Validación incorrecta

**Solución Propuesta**:
```typescript
// Verificar que categoría existe
const categories = await fetchCategories();
const hasOthers = categories.find(c => c.name === "Otros");

if (!hasOthers) {
  // Crear categoría "Otros"
}
```

### 14.2 Bug: Dashboard Totales Incorrectos

**Problema**: Los totales de ingresos/gastos no reflejan todas las transacciones.

**Investigación Necesaria**:
- Revisar query en `useMonthlyBalance`
- Verificar filtros de fecha aplicados
- Confirmar que transacciones vinculadas a metas/deudas se incluyen

**Solución Temporal**:
```typescript
// Agregar logs para debugging
console.log("Transactions fetched:", transactions.length);
console.log("Total income:", totalIncome);
console.log("Total expense:", totalExpense);
```

### 14.3 Bug: Reportes Muestran "undefined"

**Problema**: Algunos campos en reportes aparecen como "undefined".

**Causa**: Falta de traducciones i18n.

**Solución**:
```typescript
// Implementar sistema i18n
import { useTranslation } from 'next-i18next';

const { t } = useTranslation();
const label = t('report.goalStatus.completed');
```

### 14.4 Bug: Notificaciones Duplicadas

**Problema**: Las notificaciones de metas se muestran múltiples veces.

**Causa**: Polling sin deduplicación.

**Solución**:
```typescript
// En NotificationProvider
const [shownNotificationIds, setShownNotificationIds] = useState<Set<number>>(new Set());

// Al mostrar toast
if (!shownNotificationIds.has(notification.id)) {
  toast.warning(notification.title);
  setShownNotificationIds(prev => new Set(prev).add(notification.id));
}
```

---

## 15. Roadmap Frontend

### Q1 2025

**Prioridad Alta**:
- ✅ Completar dashboard con gráficos
- ✅ Corregir bugs de categorías
- ✅ Implementar reportes completos
- ✅ Agregar edición de perfil de usuario
- ⬜ Testing coverage >60%

**Prioridad Media**:
- ⬜ Implementar i18n (Inglés/Español)
- ⬜ Mejorar UX móvil
- ⬜ Agregar gráficos interactivos (Recharts/Chart.js)
- ⬜ PWA (Progressive Web App)

### Q2 2025

**Features Nuevas**:
- ⬜ Modo offline con sync
- ⬜ Exportación masiva de datos
- ⬜ Importación desde CSV
- ⬜ Compartir metas con amigos
- ⬜ Chat de soporte

**Performance**:
- ⬜ Implementar ISR (Incremental Static Regeneration)
- ⬜ Optimizar imágenes con next/image
- ⬜ Code splitting avanzado
- ⬜ Caché de service worker

### Q3 2025

**Aplicación Móvil**:
- ⬜ React Native app
- ⬜ Expo integration
- ⬜ Push notifications nativas
- ⬜ Biometric authentication

---

## 16. Conclusiones

### Fortalezas del Frontend

✅ **Arquitectura Limpia**: Separación clara de responsabilidades
✅ **Tipado Fuerte**: TypeScript en todo el proyecto  
✅ **UI Moderna**: shadcn/ui con diseño profesional
✅ **Performance**: Server Components y caché inteligente
✅ **DX Excelente**: DevTools, hot reload, tipos inferidos
✅ **Accesibilidad**: Componentes Radix UI accesibles
✅ **Testing**: Jest y React Testing Library configurados

### Áreas de Mejora

⚠️ **Testing**: Cobertura actual baja, necesita más tests  
⚠️ **i18n**: Sin internacionalización implementada
⚠️ **Documentación**: Falta documentación de componentes (Storybook)
⚠️ **Mobile**: UX puede mejorar en dispositivos móviles
⚠️ **Offline**: Sin soporte offline/PWA

### Stack Evaluation

El stack seleccionado es **excelente** para el proyecto:

- **Next.js 14**: App Router proporciona gran DX y performance
- **TanStack Query**: Manejo de estado del servidor simplificado
- **shadcn/ui**: Componentes hermosos y accesibles
- **TypeScript**: Prevención de errores en desarrollo
- **Tailwind**: Desarrollo rápido de UI

---

## Apéndices

### A. Comandos Útiles

```bash
# Desarrollo
bun dev           # Iniciar servidor desarrollo (puerto 3001)
bun build         # Build producción
bun start         # Iniciar servidor producción
bun lint          # Linter
bun test          # Ejecutar tests

# shadcn/ui
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog

# Next.js
npx next info    # Información del proyecto
```

### B. Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Última Actualización**: Octubre 2025  
**Versión Frontend**: 0.1.0  
**Mantenedor**: Equipo FoppyAI
import {
  ArrowLeftRight,
  BanknoteArrowDown,
  CreditCard,
  FileText,
  HandCoins,
  LayoutDashboard,
  LucideIcon,
  Target,
  User,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export const getAllMenuList = (pathname: string) => {
  const allMenus: Group[] = [
    {
      groupLabel: "Módulos",
      menus: [
        {
          href: "/management",
          label: "Dashboard",
          active: pathname === "/management",
          icon: LayoutDashboard,
          submenus: [],
        },

        {
          href: "/management/goals",
          label: "Metas",
          active: pathname.startsWith("/management/goals"),
          icon: Target,
          submenus: [],
        },
        {
          href: "/management/budgets",
          label: "Presupuestos",
          active: pathname.startsWith("/management/budgets"),
          icon: HandCoins,
          submenus: [],
        },
        {
          href: "/management/debts",
          label: "Deudas",
          active: pathname.startsWith("/management/debts"),
          icon: BanknoteArrowDown,
          submenus: [],
        },
        {
          href: "/management/payment-methods",
          label: "Métodos de Pago",
          active: pathname.startsWith("/management/payment-methods"),
          icon: CreditCard,
          submenus: [],
        },
        {
          href: "/management/transactions",
          label: "Transacciones",
          active: pathname.startsWith("/management/transactions"),
          icon: ArrowLeftRight,
          submenus: [],
        },
        {
          href: "/management/reports/create",
          label: "Reportes",
          active: pathname.startsWith("/management/reports/create"),
          icon: FileText,
          submenus: [],
        },
        {
          href: "/management/profile",
          label: "Mi Perfil",
          active: pathname.startsWith("/management/profile"),
          icon: User,
          submenus: [],
        },
      ],
    },
  ];
  return allMenus;
};

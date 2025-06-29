import { type UserRole, UserRoles } from "@/types"
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  User,
  Stethoscope,
  MessageCircle,
  Receipt,
  Building,
} from "lucide-react"

export interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles: UserRole[]
}

export const navigationConfig: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [UserRoles.ADMIN, UserRoles.DOCTOR, UserRoles.SECRETARY],
  },
  // Admin
  {
    title: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Docteurs",
    href: "/dashboard/doctors",
    icon: Stethoscope,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Secrétaires",
    href: "/dashboard/secretaries",
    icon: User,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Rendez-vous",
    href: "/dashboard/appointments",
    icon: Calendar,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Factures",
    href: "/dashboard/invoices",
    icon: Receipt,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Statistiques",
    href: "/dashboard/statistics",
    icon: BarChart3,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Informations Hôpital",
    href: "/dashboard/hospital",
    icon: Building,
    roles: [UserRoles.ADMIN],
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRoles.ADMIN],
  },
  // Doctor
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
    roles: [UserRoles.DOCTOR],
  },
  {
    title: "Rendez-vous",
    href: "/dashboard/appointments",
    icon: Calendar,
    roles: [UserRoles.DOCTOR],
  },
  {
    title: "Prescriptions",
    href: "/dashboard/prescriptions",
    icon: FileText,
    roles: [UserRoles.DOCTOR],
  },
  {
    title: "Messagerie",
    href: "/dashboard?view=chat",
    icon: MessageCircle,
    roles: [UserRoles.DOCTOR],
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRoles.DOCTOR],
  },
  // Secretary
  {
    title: "Rendez-vous",
    href: "/dashboard/appointments",
    icon: Calendar,
    roles: [UserRoles.SECRETARY],
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
    roles: [UserRoles.SECRETARY],
  },
  {
    title: "Factures",
    href: "/dashboard/invoices",
    icon: Receipt,
    roles: [UserRoles.SECRETARY],
  },
  {
    title: "Messagerie",
    href: "/dashboard?view=chat",
    icon: MessageCircle,
    roles: [UserRoles.SECRETARY],
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [UserRoles.SECRETARY],
  },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role))
}

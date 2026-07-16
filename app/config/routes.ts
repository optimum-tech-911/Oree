import type { LucideIcon } from "lucide-react";
import {
  BadgeHelp,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleUserRound,
  FileCheck2,
  FileText,
  Gauge,
  GitBranch,
  Handshake,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export const publicNavigation: NavigationItem[] = [
  { label: "Choisir mon statut", href: "/choisir-statut" },
  { label: "Comment ça marche", href: "/comment-ca-marche" },
  { label: "Tarifs", href: "/offres" },
];

export const clientNavigation: NavigationItem[] = [
  { label: "Vue d'ensemble", href: "/app", icon: LayoutDashboard },
  { label: "Mon projet", href: "/app/projet", icon: BriefcaseBusiness },
  { label: "Orientation", href: "/app/orientation", icon: GitBranch },
  { label: "Associés", href: "/app/associes", icon: UsersRound },
  { label: "Documents", href: "/app/documents", icon: FileText },
  { label: "Formalités", href: "/app/formalites", icon: FileCheck2 },
  { label: "Suivi", href: "/app/suivi", icon: Gauge },
  { label: "Messages", href: "/app/messages", icon: MessageSquareText },
  { label: "Rendez-vous", href: "/app/rendez-vous", icon: CalendarDays },
  { label: "Paramètres", href: "/app/parametres", icon: Settings },
];

export const opsNavigation: NavigationItem[] = [
  { label: "Pilotage", href: "/ops", icon: Gauge },
  { label: "Leads", href: "/ops/leads", icon: Sparkles },
  { label: "Projets", href: "/ops/projets", icon: Building2 },
  { label: "Documents", href: "/ops/documents", icon: FileCheck2 },
  { label: "Rendez-vous", href: "/ops/rendez-vous", icon: CalendarDays },
  { label: "Équipe", href: "/ops/equipe", icon: Handshake },
  { label: "Aide", href: "/ops/aide", icon: BadgeHelp },
  { label: "Profil", href: "/ops/profil", icon: CircleUserRound },
];

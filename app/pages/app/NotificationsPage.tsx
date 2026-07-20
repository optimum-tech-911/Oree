import { useQuery } from "@tanstack/react-query";
import { Bell, CalendarDays, FileText, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { AppPageHero } from "@/components/app/AppPageHero";
import { Card } from "@/components/ui/Card";
import { portalRepository } from "@/services/supabase/portal";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NotificationsPage() {
  usePageMeta("Notifications", "Retrouvez les éléments du projet qui nécessitent votre attention.");
  const { data, error } = useQuery({ queryKey: ["portal", "snapshot"], queryFn: portalRepository.getSnapshot });
  const items = [
    ...(data?.documents.filter((item) => ["required", "changes_requested", "rejected"].includes(item.status)).map((item) => ({ id: `document-${item.id}`, title: item.label, description: item.comment || "Un document ou une nouvelle version est attendu.", date: item.updatedAt, href: "/app/documents", icon: FileText })) ?? []),
    ...(data?.messages.filter((item) => !item.isOwn && !item.read).map((item) => ({ id: `message-${item.id}`, title: "Nouveau message de l’équipe", description: item.body, date: item.createdAt, href: "/app/messages", icon: MessageSquareText })) ?? []),
    ...(data?.appointments.filter((item) => ["requested", "confirmed"].includes(item.status)).map((item) => ({ id: `appointment-${item.id}`, title: item.status === "confirmed" ? "Rendez-vous confirmé" : "Demande de rendez-vous en attente", description: new Date(item.startsAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }), date: item.startsAt, href: "/app/rendez-vous", icon: CalendarDays })) ?? []),
  ].sort((a, b) => Date.parse(b.date ?? "") - Date.parse(a.date ?? ""));
  return <div className="mx-auto max-w-6xl space-y-5"><AppPageHero icon={Bell} eyebrow="Centre de notifications" title={<>Les événements importants, <span className="gradient-text">reliés à leur action.</span></>} description="Cette vue est calculée depuis les documents, messages et rendez-vous réellement accessibles au compte." stat={{ value: String(items.length), label: "À examiner" }} />{error ? <Card className="p-5 text-[color:var(--blue)]">{error instanceof Error ? error.message : "Chargement impossible"}</Card> : null}<Card className="overflow-hidden"><div className="divide-y divide-[var(--line)]">{items.map((item) => { const Icon = item.icon; return <Link key={item.id} to={item.href} className="group flex items-start gap-4 p-5 transition hover:bg-[var(--paper)] sm:p-6"><span className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-[var(--mint-soft)]"><Icon className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="font-semibold">{item.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>{item.date ? <p className="mt-2 text-xs text-[color:var(--muted)]">{new Date(item.date).toLocaleString("fr-FR")}</p> : null}</div><span className="text-sm font-semibold text-[color:var(--blue)]">Ouvrir →</span></Link>; })}{items.length === 0 ? <div className="p-12 text-center"><Bell className="mx-auto size-6 text-[color:var(--muted)]" /><p className="mt-4 font-semibold">Aucune action signalée.</p><p className="mt-2 text-sm text-[color:var(--muted)]">Les nouvelles demandes apparaîtront ici.</p></div> : null}</div></Card></div>;
}

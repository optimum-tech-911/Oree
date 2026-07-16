import { useMemo, useState } from "react";
import { Bell, CheckCheck, FileText, MessageSquareText, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { AppPageHero } from "@/components/app/AppPageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { usePageMeta } from "@/hooks/usePageMeta";

const initialNotifications = [
  { id: "document", title: "Correction demandée sur le justificatif de siège", description: "Une version récente est nécessaire avant la validation documentaire.", date: "Aujourd'hui · 10:18", href: "/app/documents", icon: FileText, read: false },
  { id: "message", title: "Nouveau message de l'équipe Orée", description: "Les critères attendus pour le justificatif ont été précisés dans la conversation.", date: "Aujourd'hui · 09:42", href: "/app/messages", icon: MessageSquareText, read: false },
  { id: "appointment", title: "Rendez-vous confirmé", description: "Le point de validation documentaire est prévu le 17 juillet à 16 h 30.", date: "15 juillet · 17:06", href: "/app/rendez-vous", icon: CalendarDays, read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  usePageMeta("Notifications", "Consultez les événements importants et accédez directement aux actions correspondantes.");

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <AppPageHero icon={Bell} eyebrow="Centre de notifications" title={<>Les événements importants, <span className="gradient-text">reliés à leur action.</span></>} description="Chaque notification précise son origine et conduit vers la partie du dossier qui nécessite votre attention." stat={{ value: String(unread), label: "Non lues" }} action={<Button variant="dark" onClick={markAllRead} disabled={unread === 0}><CheckCheck className="size-4" />Tout marquer comme lu</Button>} />
      <Card className="overflow-hidden">
        <div className="divide-y divide-[var(--line)]">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} to={item.href} onClick={() => setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))} className="group flex items-start gap-4 p-5 transition hover:bg-[var(--paper)] sm:p-6">
                <span className={`grid size-12 shrink-0 place-items-center rounded-[18px] ${item.read ? "bg-[var(--paper)] text-[color:var(--muted)]" : "bg-[var(--mint)] text-[color:var(--ink)]"}`}><Icon className="size-5" /></span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold sm:text-base">{item.title}</h2>{!item.read ? <span className="size-2 rounded-full bg-[var(--blue)]" aria-label="Non lue" /> : null}</div><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p><p className="mt-3 text-xs font-semibold text-[color:var(--muted)]">{item.date}</p></div>
                <span className="mt-3 text-sm font-semibold text-[color:var(--blue)] transition group-hover:translate-x-1">Ouvrir →</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

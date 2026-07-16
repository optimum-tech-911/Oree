import { useState } from "react";
import { Bell, Check, Download, LockKeyhole, Mail, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { ActionNotice } from "@/components/feedback/ActionNotice";
import { Card } from "@/components/ui/Card";
import { AppPageHero } from "@/components/app/AppPageHero";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { safeStorage } from "@/lib/storage";

const SETTINGS_KEY = "oree:settings:v1";
const defaultSettings = {
  profile: { firstName: "Utilisateur", lastName: "Démo", email: "utilisateur@exemple.fr" },
  notifications: { documents: true, messages: true, appointments: true, marketing: false },
};

function loadSettings() {
  const saved = safeStorage.get(SETTINGS_KEY);
  if (!saved) return defaultSettings;
  try { return { ...defaultSettings, ...JSON.parse(saved) as Partial<typeof defaultSettings> }; } catch { return defaultSettings; }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(loadSettings);
  const [notice, setNotice] = useState<{ title: string; description: string; tone?: "success" | "info" } | null>(null);
  usePageMeta("Paramètres", "Gérez votre profil, les notifications, la sécurité et vos droits sur les données.");
  const toggle = (key: keyof typeof settings.notifications) => setSettings((current) => ({ ...current, notifications: { ...current.notifications, [key]: !current.notifications[key] } }));

  function save() {
    safeStorage.set(SETTINGS_KEY, JSON.stringify(settings));
    setNotice({ title: "Préférences enregistrées", description: "Les modifications sont conservées dans ce navigateur pour la démonstration." });
  }

  function exportData() {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), settings, scope: "Données de démonstration présentes dans ce navigateur" }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "oree-export-demonstration.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice({ title: "Export préparé", description: "Le fichier contient uniquement les préférences de démonstration stockées dans ce navigateur." });
  }

  return <div className="mx-auto max-w-6xl space-y-5">
    <AppPageHero icon={UserRound} eyebrow="Compte et préférences" title={<>Maîtrisez les paramètres de <span className="gradient-text">votre espace.</span></>} description="Le profil, les notifications, la sécurité et les demandes relatives aux données sont réunis dans une interface directement actionnable." action={<Button variant="dark" onClick={save}><Save className="size-4" />Enregistrer</Button>} />
    {notice ? <ActionNotice title={notice.title} description={notice.description} tone={notice.tone} onClose={() => setNotice(null)} /> : null}
    <div className="grid gap-5 lg:grid-cols-2"><Card className="p-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-soft)]"><UserRound className="size-5" /></span><div><h3 className="font-semibold">Profil</h3><p className="text-xs text-[color:var(--muted)]">Informations utilisées dans votre espace</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Prénom<input value={settings.profile.firstName} onChange={(event) => setSettings((current) => ({ ...current, profile: { ...current.profile, firstName: event.target.value } }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal outline-none focus:border-[var(--blue)]" /></label><label className="text-sm font-semibold">Nom<input value={settings.profile.lastName} onChange={(event) => setSettings((current) => ({ ...current, profile: { ...current.profile, lastName: event.target.value } }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal outline-none focus:border-[var(--blue)]" /></label><label className="text-sm font-semibold sm:col-span-2">Adresse email<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" /><input type="email" value={settings.profile.email} onChange={(event) => setSettings((current) => ({ ...current, profile: { ...current.profile, email: event.target.value } }))} className="h-12 w-full rounded-2xl border border-[var(--line)] pl-11 pr-4 font-normal outline-none focus:border-[var(--blue)]" /></div></label></div></Card><Card className="p-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-[color:var(--blue)]"><Bell className="size-5" /></span><div><h3 className="font-semibold">Notifications</h3><p className="text-xs text-[color:var(--muted)]">Sélectionnez les informations que vous souhaitez recevoir</p></div></div><div className="mt-6 divide-y divide-[var(--line)]">{[
      ["documents", "Documents", "Demandes, validations et corrections"],
      ["messages", "Messages", "Nouveau message relatif au projet"],
      ["appointments", "Rendez-vous", "Confirmations et rappels"],
      ["marketing", "Informations commerciales", "Conseils et offres facultatifs"],
    ].map(([key, title, description]) => <div key={key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"><div className="flex-1"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-[color:var(--muted)]">{description}</p></div><button type="button" onClick={() => toggle(key as keyof typeof settings.notifications)} className={`relative h-7 w-12 rounded-full transition ${settings.notifications[key as keyof typeof settings.notifications] ? "bg-[var(--ink)]" : "bg-slate-200"}`} role="switch" aria-checked={settings.notifications[key as keyof typeof settings.notifications]} aria-label={`Notifications : ${title}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${settings.notifications[key as keyof typeof settings.notifications] ? "left-6" : "left-1"}`} /></button></div>)}</div></Card>
      <Card className="p-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--paper)]"><LockKeyhole className="size-5" /></span><div><h3 className="font-semibold">Sécurité</h3><p className="text-xs text-[color:var(--muted)]">Session et méthodes de connexion</p></div></div><div className="mt-6 space-y-3"><div className="flex items-center justify-between rounded-2xl border border-[var(--line)] p-4"><div><p className="text-sm font-semibold">Lien de connexion et mot de passe</p><p className="mt-1 text-xs text-[color:var(--muted)]">Pris en charge par Supabase Auth après configuration</p></div><span className="rounded-full bg-[var(--mint-soft)] px-2.5 py-1 text-xs font-bold text-[color:var(--ink)]">Prévu</span></div><div className="flex items-center justify-between rounded-2xl border border-[var(--line)] p-4"><div><p className="text-sm font-semibold">Authentification multifacteur</p><p className="mt-1 text-xs text-[color:var(--muted)]">Recommandée pour les comptes internes</p></div><button type="button" onClick={() => setNotice({ title: "Configuration multifacteur indisponible en démonstration", description: "Cette fonction sera proposée uniquement après connexion au service d'authentification.", tone: "info" })} className="text-sm font-semibold">Configurer</button></div></div></Card><Card className="p-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-soft)]"><ShieldCheck className="size-5" /></span><div><h3 className="font-semibold">Vos données</h3><p className="text-xs text-[color:var(--muted)]">Accès, export et suppression</p></div></div><div className="mt-6 space-y-3"><button type="button" onClick={exportData} className="flex w-full items-center justify-between rounded-2xl border border-[var(--line)] p-4 text-left transition hover:bg-[var(--paper)]"><div className="flex items-center gap-3"><Download className="size-4" /><div><p className="text-sm font-semibold">Exporter mes données de démonstration</p><p className="mt-1 text-xs text-[color:var(--muted)]">Télécharger les préférences stockées dans ce navigateur</p></div></div><span className="text-sm">→</span></button><button type="button" onClick={() => { safeStorage.set("oree:deletion-request:v1", new Date().toISOString()); setNotice({ title: "Demande de suppression enregistrée", description: "Dans le service connecté, cette demande sera examinée au regard des obligations légales de conservation.", tone: "info" }); }} className="flex w-full items-center justify-between rounded-2xl border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-4 text-left text-[color:var(--ink)]"><div className="flex items-center gap-3"><Trash2 className="size-4" /><div><p className="text-sm font-semibold">Demander la suppression</p><p className="mt-1 text-xs text-[color:var(--ink)]/65">Sous réserve des obligations de conservation applicables</p></div></div><span className="text-sm">→</span></button></div></Card></div>
    <Card className="border-[var(--mint)] bg-[var(--mint-soft)] p-5"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[var(--mint)] text-white"><Check className="size-4" /></span><p className="text-sm font-semibold text-[color:var(--ink)]">Les communications commerciales restent désactivées tant que vous ne les avez pas expressément autorisées.</p></div></Card>
  </div>;
}

import { useState, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Download, LockKeyhole, Mail, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AppPageHero } from "@/components/app/AppPageHero";
import { Button } from "@/components/ui/Button";
import { portalRepository, type PortalProfile } from "@/services/supabase/portal";
import { usePageMeta } from "@/hooks/usePageMeta";

const emptyProfile: PortalProfile = {
  firstName: "", lastName: "", phone: "", email: "", timezone: "Europe/Paris", availabilityNote: "",
  notificationPreferences: { email: true, documents: true, appointments: true, messages: true, marketing: false },
};
const notificationOptions = [
  ["documents", "Documents"], ["messages", "Messages"], ["appointments", "Rendez-vous"],
  ["email", "Canal email"], ["marketing", "Informations commerciales"],
] as const;

export default function SettingsPage() {
  usePageMeta("Paramètres", "Gérez votre profil, notifications, sécurité et demandes relatives aux données.");
  const client = useQueryClient();
  const { data, error } = useQuery({ queryKey: ["portal", "snapshot"], queryFn: portalRepository.getSnapshot });
  const baseProfile = data?.profile ? { ...data.profile, notificationPreferences: { ...emptyProfile.notificationPreferences, ...data.profile.notificationPreferences } } : emptyProfile;
  const [draftProfile, setDraftProfile] = useState<PortalProfile | null>(null);
  const profile = draftProfile ?? baseProfile;
  function setProfile(action: SetStateAction<PortalProfile>) {
    setDraftProfile(typeof action === "function" ? action(profile) : action);
  }
  const save = useMutation({ mutationFn: () => portalRepository.saveProfile(profile), onSuccess: async () => client.invalidateQueries({ queryKey: ["portal", "snapshot"] }) });
  const dataRequest = useMutation({ mutationFn: (type: "export" | "deletion") => portalRepository.requestDataAction(type) });

  function toggle(key: string) {
    setProfile((current) => ({ ...current, notificationPreferences: { ...current.notificationPreferences, [key]: !current.notificationPreferences[key] } }));
  }
  function exportVisibleData() {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), project: data?.project, profile: data?.profile, documents: data?.documents.map((document) => ({ ...document, storagePath: undefined })), appointments: data?.appointments, timeline: data?.timeline }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "oree-export-espace.json"; link.click(); URL.revokeObjectURL(url);
    dataRequest.mutate("export");
  }

  return <div className="mx-auto max-w-6xl space-y-5">
    <AppPageHero icon={UserRound} eyebrow="Compte et préférences" title={<>Maîtrisez les paramètres de <span className="gradient-text">votre espace.</span></>} description="Le profil et les préférences sont stockés dans votre compte. L’adresse de connexion reste administrée par Supabase Auth." action={<Button variant="dark" onClick={() => save.mutate()} disabled={save.isPending}><Save className="size-4" />{save.isPending ? "Enregistrement…" : "Enregistrer"}</Button>} />
    {error || save.error ? <Card className="p-5 text-[color:var(--blue)]">{(error ?? save.error) instanceof Error ? (error ?? save.error as Error).message : "Action impossible"}</Card> : null}
    {save.isSuccess ? <Card className="border-[var(--mint)] bg-[var(--mint-soft)] p-4 text-sm font-semibold"><Check className="mr-2 inline size-4" />Préférences enregistrées.</Card> : null}
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-soft)]"><UserRound className="size-5" /></span><div><h2 className="font-semibold">Profil</h2><p className="text-xs text-[color:var(--muted)]">Informations de votre espace</p></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Prénom<input value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label>
          <label className="text-sm font-semibold">Nom<input value={profile.lastName} onChange={(event) => setProfile((current) => ({ ...current, lastName: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label>
          <label className="text-sm font-semibold sm:col-span-2">Adresse de connexion<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" /><input readOnly value={profile.email} className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] pl-11 pr-4 font-normal" /></div></label>
          <label className="text-sm font-semibold">Téléphone<input value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label>
          <label className="text-sm font-semibold">Fuseau horaire<input value={profile.timezone} onChange={(event) => setProfile((current) => ({ ...current, timezone: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label>
          <label className="text-sm font-semibold sm:col-span-2">Contraintes de disponibilité<textarea rows={3} value={profile.availabilityNote} onChange={(event) => setProfile((current) => ({ ...current, availabilityNote: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal" /></label>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--paper)]"><Bell className="size-5" /></span><div><h2 className="font-semibold">Notifications</h2><p className="text-xs text-[color:var(--muted)]">Préférences par catégorie</p></div></div>
        <div className="mt-6 divide-y divide-[var(--line)]">{notificationOptions.map(([key, label]) => <div key={key} className="flex items-center justify-between py-4"><p className="text-sm font-semibold">{label}</p><button type="button" role="switch" aria-checked={Boolean(profile.notificationPreferences[key])} onClick={() => toggle(key)} className={`relative h-7 w-12 rounded-full ${profile.notificationPreferences[key] ? "bg-[var(--ink)]" : "bg-[var(--ink)]/15"}`}><span className={`absolute top-1 size-5 rounded-full bg-white transition ${profile.notificationPreferences[key] ? "left-6" : "left-1"}`} /></button></div>)}</div>
        <p className="mt-4 text-xs leading-5 text-[color:var(--muted)]">La préférence marketing ne vaut consentement que si le cadre juridique et le canal réel le permettent.</p>
      </Card>
      <Card className="p-6"><LockKeyhole className="size-5" /><h2 className="mt-4 font-semibold">Sécurité du compte</h2><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Les sessions, mots de passe et liens de connexion sont gérés par Supabase Auth. Les rôles internes ne sont jamais modifiables ici.</p></Card>
      <Card className="p-6"><ShieldCheck className="size-5 text-[color:var(--blue)]" /><h2 className="mt-4 font-semibold">Vos données</h2><div className="mt-5 space-y-3"><button onClick={exportVisibleData} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] p-4 text-left"><Download className="size-4" /><div><p className="text-sm font-semibold">Exporter les données visibles</p><p className="mt-1 text-xs text-[color:var(--muted)]">Prépare un fichier local et enregistre une demande d’export.</p></div></button><button onClick={() => dataRequest.mutate("deletion")} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-4 text-left"><Trash2 className="size-4" /><div><p className="text-sm font-semibold">Demander la suppression</p><p className="mt-1 text-xs text-[color:var(--muted)]">La demande sera examinée selon les obligations de conservation.</p></div></button>{dataRequest.isSuccess ? <p className="text-sm font-semibold text-[color:var(--success)]">Demande enregistrée.</p> : null}</div></Card>
    </div>
  </div>;
}

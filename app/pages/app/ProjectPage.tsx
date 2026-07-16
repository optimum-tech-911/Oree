import { useState } from "react";
import { Building2, Check, MapPin, PencilLine, Save, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppPageHero } from "@/components/app/AppPageHero";
import { ActionNotice } from "@/components/feedback/ActionNotice";
import { usePageMeta } from "@/hooks/usePageMeta";
import { safeStorage } from "@/lib/storage";

const PROJECT_FORM_KEY = "oree:project-form:v1";
const defaultForm = {
  name: "Studio Horizon",
  legalForm: "SASU",
  activity: "Conseil en stratégie digitale et accompagnement à la transformation numérique",
  department: "34 — Hérault",
  desiredDate: "2026-09-30",
  capital: "2 000",
  address: "Domiciliation en cours de validation",
};

function loadForm() {
  const saved = safeStorage.get(PROJECT_FORM_KEY);
  if (!saved) return defaultForm;
  try { return { ...defaultForm, ...JSON.parse(saved) as Partial<typeof defaultForm> }; } catch { return defaultForm; }
}

export default function ProjectPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(loadForm);
  usePageMeta("Mon projet", "Informations principales, activité, siège, capital et calendrier du projet.");
  const field = (label: string, key: keyof typeof form, type = "text") => <label className="block text-sm font-semibold">{label}<input type={type} value={form[key]} onChange={(event) => { setSaved(false); setForm((current) => ({ ...current, [key]: event.target.value })); }} className="mt-2 h-13 w-full rounded-2xl border border-[var(--line)] bg-white px-4 font-normal outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-50" /></label>;
  return <div className="mx-auto max-w-6xl space-y-5">
    <AppPageHero icon={Building2} eyebrow="Fiche projet" title={<>{form.name || "Votre projet"}, <span className="gradient-text">informations de référence.</span></>} description="Ces informations alimentent l'orientation, la liste documentaire et les prochaines actions. Les données déjà validées pourront être verrouillées selon l'état du dossier." stat={{ value: "78%", label: "Complétude" }} action={<Button variant="dark" onClick={() => { safeStorage.set(PROJECT_FORM_KEY, JSON.stringify(form)); setSaved(true); }}><Save className="size-4" />Enregistrer</Button>} />
    {saved ? <ActionNotice title="Projet enregistré" description="Les modifications sont conservées dans ce navigateur pour la démonstration." onClose={() => setSaved(false)} /> : null}
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card className="p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-soft)]"><PencilLine className="size-5" /></span><div><p className="font-semibold">Informations principales</p><p className="text-xs text-[color:var(--muted)]">Enregistrez vos modifications avant de quitter cette page.</p></div></div><div className="mt-7 grid gap-5 sm:grid-cols-2">{field("Nom du projet", "name")}<label className="block text-sm font-semibold">Forme envisagée<select value={form.legalForm} onChange={(event) => { setSaved(false); setForm((current) => ({ ...current, legalForm: event.target.value })); }} className="mt-2 h-13 w-full rounded-2xl border border-[var(--line)] bg-white px-4 font-normal outline-none focus:border-[var(--blue)]"><option>SASU</option><option>EURL</option><option>À confirmer</option></select></label><label className="block text-sm font-semibold sm:col-span-2">Description de l'activité<textarea value={form.activity} onChange={(event) => { setSaved(false); setForm((current) => ({ ...current, activity: event.target.value })); }} rows={4} className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-50" /></label>{field("Département", "department")}{field("Date souhaitée", "desiredDate", "date")}{field("Capital envisagé (€)", "capital")}{field("Siège social", "address")}</div></Card>
      <div className="space-y-5"><Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[color:var(--muted)]">Complétude</p><p className="mt-3 text-4xl font-semibold tracking-[-.05em]">78%</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--ink)]/8"><div className="h-full w-[78%] rounded-full bg-[var(--mint)]" /></div><div className="mt-5 space-y-3">{["Activité définie", "Calendrier indiqué", "Capital renseigné"].map((item) => <div key={item} className="flex items-center gap-2 text-sm"><span className="grid size-6 place-items-center rounded-full bg-[var(--mint-soft)]"><Check className="size-3" /></span>{item}</div>)}<div className="flex items-center gap-2 text-sm text-[color:var(--muted)]"><span className="size-6 rounded-full border border-[var(--line)]" />Siège à confirmer</div></div></Card><Card className="p-5"><span className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-[color:var(--blue)]"><MapPin className="size-5" /></span><h3 className="mt-5 font-semibold">Siège social</h3><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Le choix du siège détermine les justificatifs à fournir et peut affecter certaines formalités.</p><ButtonLink to="/choisir-statut" variant="ghost" className="mt-4 h-auto p-0 text-sm">Comparer les options</ButtonLink></Card><Card className="bg-[var(--ink)] p-5 text-white"><Sparkles className="size-5 text-[color:var(--mint)]" /><h3 className="mt-4 font-semibold">Repère de planification</h3><p className="mt-2 text-sm leading-6 text-white/72">Au regard des informations saisies, une préparation sur six à huit semaines constitue une hypothèse de travail à confirmer.</p></Card></div>
    </div>
  </div>;
}

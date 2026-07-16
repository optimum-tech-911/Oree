import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Check, Clock3, MessageSquareText, Phone, ShieldCheck, Video } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EditorialMediaCard } from "@/components/media/EditorialMediaCard";
import { imagery } from "@/content/imagery";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/cn";
import { analytics } from "@/services/analytics";

const days = [
  { date: "16", day: "Jeu." },
  { date: "17", day: "Ven." },
  { date: "20", day: "Lun." },
  { date: "21", day: "Mar." },
  { date: "22", day: "Mer." },
] as const;
const slots = ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"];

export default function AppointmentPage() {
  const [day, setDay] = useState("17");
  const [slot, setSlot] = useState("16:30");
  const [type, setType] = useState<"phone" | "video">("video");
  const [booked, setBooked] = useState(false);
  const selectedDay = days.find((item) => item.date === day) ?? days[1];
  const summary = useMemo(() => `${selectedDay.day} ${day} juillet 2026 à ${slot}`, [day, selectedDay.day, slot]);
  usePageMeta("Prendre rendez-vous", "Réservez un échange de cadrage, d'orientation ou de suivi de dossier.");

  return (
    <section className="hero-grid surface-noise relative min-h-screen overflow-hidden bg-[var(--night)] pb-20 pt-34 text-white sm:pt-42 lg:pb-28 lg:pt-44">
      <div className="glow-mint -left-48 top-44 opacity-65" />
      <div className="container-shell relative z-10 grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-18">
        <div className="lg:sticky lg:top-32">
          <Badge className="border-white/12 bg-white/[.06] text-white/70"><CalendarDays className="size-3.5 text-[color:var(--mint)]" />Rendez-vous contextualisé</Badge>
          <h1 className="mt-7 text-balance text-[clamp(3.4rem,6.2vw,7.2rem)] font-semibold leading-[.9] tracking-[-.075em]">Un échange préparé à partir du <span className="gradient-text">contexte de votre projet.</span></h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">Sélectionnez un format et un créneau. Une fois le calendrier connecté, les informations utiles du diagnostic pourront être associées au rendez-vous avec votre accord.</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[[MessageSquareText, "Cadrage utile", "La discussion commence là où le diagnostic s'arrête."], [Clock3, "30 minutes", "Un format précis, sans longue reprise de contexte."], [ShieldCheck, "Confirmation claire", "Créneau, format et interlocuteur visibles avant validation."]].map(([Icon, title, description]) => { const Component = Icon as typeof Check; return <div key={String(title)} className="flex gap-4 rounded-[22px] border border-white/[.08] bg-white/[.035] p-4 backdrop-blur"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/[.08]"><Component className="size-5 text-[color:var(--mint)]" /></span><div><p className="font-semibold text-white/88">{String(title)}</p><p className="mt-1 text-xs leading-5 text-white/72">{String(description)}</p></div></div>; })}
          </div>
          <div className="mt-6 hidden lg:block"><EditorialMediaCard asset={imagery.remoteAppointment} eyebrow="Échange illustratif" title="Le rendez-vous prolonge le diagnostic."><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">La scène ne représente ni un client réel ni un membre identifié de l'équipe.</p></EditorialMediaCard></div>
        </div>

        <div className="glass-panel overflow-hidden rounded-[38px]">
          <AnimatePresence mode="wait">
            {booked ? (
              <motion.div key="success" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="grid min-h-[640px] place-items-center p-8 text-center sm:p-12">
                <div><span className="animate-pulse-ring mx-auto grid size-18 place-items-center rounded-[25px] bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-8" /></span><p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-white/72">Sélection enregistrée en démonstration</p><h2 className="mx-auto mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-.055em] sm:text-5xl">{summary}</h2><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/72">Aucun événement externe n'a été créé. La réservation effective sera activée après connexion au fournisseur de calendrier retenu.</p><div className="mx-auto mt-7 flex max-w-sm items-center gap-3 rounded-2xl border border-white/[.08] bg-white/[.04] p-4 text-left"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--mint)] text-xs font-extrabold text-[color:var(--ink)]">OR</span><div><p className="text-sm font-semibold">Équipe Orée</p><p className="mt-1 text-xs text-white/72">Suivi du projet · {type === "video" ? "Visioconférence" : "Téléphone"}</p></div></div><Button onClick={() => setBooked(false)} variant="dark" className="mt-8">Modifier le créneau</Button></div>
              </motion.div>
            ) : (
              <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-[1fr_320px]">
                <div className="p-5 sm:p-7 lg:p-8">
                  <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/72">Juillet 2026</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.045em] sm:text-3xl">Choisissez votre moment.</h2></div><span className="grid size-12 place-items-center rounded-2xl border border-white/[.08] bg-white/[.055]"><CalendarDays className="size-5 text-[color:var(--mint)]" /></span></div>
                  <div className="mt-8 grid grid-cols-5 gap-2">{days.map((item) => <button key={item.date} onClick={() => setDay(item.date)} className={cn("rounded-[16px] border px-2 py-3.5 text-center transition duration-300", day === item.date ? "border-[var(--action)] bg-[var(--action)] text-white shadow-[0_14px_36px_rgba(36,87,255,.22)]" : "border-white/[.08] bg-white/[.035] text-white hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[.07]")}><span className="block text-[10px] font-semibold uppercase tracking-[.08em] opacity-70">{item.day}</span><span className="mt-1 block text-lg font-bold">{item.date}</span></button>)}</div>
                  <p className="mt-8 text-sm font-semibold text-white/75">Horaires disponibles</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{slots.map((time) => <button key={time} onClick={() => setSlot(time)} className={cn("rounded-[16px] border px-3 py-3.5 text-sm font-bold transition duration-300", slot === time ? "border-[var(--accent)]/70 bg-[var(--accent)] text-white shadow-[0_12px_30px_rgba(36,87,255,.22)]" : "border-white/[.08] bg-white/[.035] text-white/72 hover:border-white/18 hover:bg-white/[.07]")}>{time}</button>)}</div>
                  <p className="mt-8 text-sm font-semibold text-white/75">Format de l'échange</p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5"><button onClick={() => setType("video")} className={cn("flex items-center gap-3 rounded-[16px] border p-4 text-left text-sm font-semibold transition duration-300", type === "video" ? "border-[var(--action)] bg-[var(--action)]/18 text-white" : "border-white/[.08] bg-white/[.035] text-white/72 hover:bg-white/[.07]")}><span className={cn("grid size-9 place-items-center rounded-xl", type === "video" ? "bg-[var(--action)] text-white" : "bg-white/[.06]")}><Video className="size-4" /></span><span>Visioconférence</span></button><button onClick={() => setType("phone")} className={cn("flex items-center gap-3 rounded-[16px] border p-4 text-left text-sm font-semibold transition duration-300", type === "phone" ? "border-[var(--action)] bg-[var(--action)]/18 text-white" : "border-white/[.08] bg-white/[.035] text-white/72 hover:bg-white/[.07]")}><span className={cn("grid size-9 place-items-center rounded-xl", type === "phone" ? "bg-[var(--action)] text-white" : "bg-white/[.06]")}><Phone className="size-4" /></span><span>Téléphone</span></button></div>
                </div>

                <aside className="border-t border-white/[.08] bg-black/18 p-5 lg:border-l lg:border-t-0 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[.16em] text-white/72">Votre sélection</p>
                  <div className="mt-6 rounded-[23px] border border-white/[.08] bg-white/[.05] p-5"><p className="text-sm font-semibold">Point création</p><p className="mt-2 text-sm leading-6 text-white/72">{summary}</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/70"><span className="grid size-8 place-items-center rounded-full bg-[var(--action)] text-white">{type === "video" ? <Video className="size-3.5" /> : <Phone className="size-3.5" />}</span>{type === "video" ? "Visioconférence" : "Téléphone"}</div></div>
                  <div className="mt-4 rounded-[23px] border border-white/[.08] bg-white/[.05] p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[14px] bg-[var(--mint)] text-xs font-extrabold text-[color:var(--ink)]">OR</span><div><p className="text-xs font-semibold">Équipe Orée</p><p className="mt-1 text-[11px] text-white/72">Suivi du projet</p></div></div></div>
                  <Button variant="dark" className="mt-6 w-full" size="lg" onClick={() => { setBooked(true); analytics.track("appointment_booked", { day, slot, type }); }}>Confirmer le créneau</Button><p className="mt-3 text-center text-[10px] leading-4 text-white/72">Démonstration sans connexion calendrier.</p>
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

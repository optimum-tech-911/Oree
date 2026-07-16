import { Link } from "react-router-dom";
import { ArrowRight, Check, CircleHelp } from "lucide-react";
import { legalForms } from "@/data/legalForms";
import { Reveal } from "@/components/marketing/Reveal";

const formAccent: Record<string, string> = {
  SASU: "bg-[var(--blue)] text-white",
  EURL: "bg-[var(--mint)] text-[color:var(--ink)]",
  SAS: "bg-[var(--ink)] text-white",
  SARL: "bg-white text-[color:var(--ink)] border border-[var(--line)]",
};

export function LegalFormCards({ codes = ["SASU", "EURL", "SAS", "SARL"] }: { codes?: string[] }) {
  const forms = legalForms.filter((form) => codes.includes(form.code));
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {forms.map((form, index) => (
        <Reveal key={form.code} delay={index * .055}>
          <Link to={`/creation-${form.code.toLowerCase()}`} className="interactive-card group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[var(--line)] bg-white/88 p-5 backdrop-blur-xl sm:p-6">
            <span className={`absolute inset-x-0 top-0 h-1 ${index % 2 === 0 ? "bg-[var(--blue)]" : "bg-[var(--mint)]"}`} />
            <div className="flex items-start justify-between gap-4">
              <div><span className="rounded-full bg-[var(--paper)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[color:var(--muted)]">{form.founderCount === "solo" ? "Créer seul" : "Créer à plusieurs"}</span><h3 className="mt-5 text-[2.65rem] font-extrabold leading-none tracking-[-.075em]">{form.label}</h3></div>
              <span className={`grid size-11 shrink-0 place-items-center rounded-[17px] shadow-[0_14px_38px_rgba(11,18,32,.13)] transition duration-400 group-hover:rotate-6 group-hover:scale-105 ${formAccent[form.code] ?? "bg-[var(--blue)] text-white"}`}><ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span>
            </div>
            <p className="mt-4 min-h-[72px] text-sm leading-6 text-[color:var(--muted)]">{form.summary}</p>
            <ul className="mt-5 space-y-2.5 border-t border-[var(--line)] pt-5">{form.bestFor.slice(0, 3).map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-5"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--mint-soft)]"><Check className="size-3" /></span>{item}</li>)}</ul>
            <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs font-bold"><span className="inline-flex items-center gap-1.5 text-[color:var(--muted)]"><CircleHelp className="size-3.5" />À confirmer selon votre situation</span><span className="shrink-0 text-[color:var(--blue)]">Voir</span></div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

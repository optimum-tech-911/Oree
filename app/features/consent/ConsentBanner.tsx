import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Settings2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { readConsent, writeConsent } from "@/features/consent/consent";

export function ConsentBanner() {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState(() => readConsent());
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  if (choice || pathname.startsWith("/app") || pathname.startsWith("/ops") || pathname.startsWith("/auth") || ["/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"].includes(pathname)) {
    return null;
  }

  const save = (next: { analytics: boolean; marketing: boolean }) => setChoice(writeConsent(next));

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[75] mx-auto max-w-[720px] overflow-hidden rounded-[1.6rem] border border-white/15 bg-[var(--ink)]/96 p-4 text-white shadow-[0_24px_80px_rgba(11,18,32,.32)] backdrop-blur-xl sm:p-5"
      aria-label="Préférences de confidentialité"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">Vos choix, avant toute mesure publicitaire</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/68">
                Les cookies nécessaires font fonctionner la plateforme. La mesure d’audience et la publicité restent désactivables, sans bloquer votre diagnostic.
              </p>
            </div>
            {details ? (
              <button className="grid size-9 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white" onClick={() => setDetails(false)} aria-label="Fermer les réglages">
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          {details ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <ConsentToggle label="Nécessaires" description="Sécurité, session et préférences." checked disabled onChange={() => undefined} />
              <ConsentToggle label="Mesure d’audience" description="Comprendre les parcours et améliorer les pages." checked={analytics} onChange={setAnalytics} />
              <ConsentToggle label="Publicité" description="Mesurer et optimiser les campagnes Google Ads." checked={marketing} onChange={setMarketing} />
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button size="sm" variant="dark" onClick={() => save(details ? { analytics, marketing } : { analytics: true, marketing: true })}>
              {details ? "Enregistrer mes choix" : "Tout autoriser"}
            </Button>
            <Button size="sm" variant="ghost" className="border border-white/15 text-white hover:bg-white/10" onClick={() => save({ analytics: false, marketing: false })}>
              Tout refuser
            </Button>
            {!details ? (
              <button className="inline-flex h-10 items-center justify-center gap-2 px-3 text-sm font-semibold text-white/75 hover:text-white" onClick={() => setDetails(true)}>
                <Settings2 className="size-4" /> Personnaliser
              </button>
            ) : null}
            <Link to="/confidentialite" className="sm:ml-auto text-center text-xs font-medium text-white/72 underline decoration-white/25 underline-offset-4 hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ConsentToggle({ label, description, checked, disabled = false, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 ${checked ? "border-white/20 bg-white/10" : "border-white/10 bg-white/[.03]"} ${disabled ? "cursor-default opacity-70" : ""}`}>
      <input className="sr-only" type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${checked ? "border-[var(--mint)] bg-[var(--mint)] text-[color:var(--ink)]" : "border-white/25"}`}>
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-white/72">{description}</span>
      </span>
    </label>
  );
}

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
      className={`fixed inset-x-2 bottom-2 z-[75] mx-auto max-w-[720px] rounded-[1.25rem] border border-white/15 bg-[var(--ink)]/98 p-3 text-white shadow-[0_24px_80px_rgba(11,18,32,.32)] backdrop-blur-xl sm:inset-x-3 sm:bottom-3 sm:max-h-[calc(100dvh-1.5rem)] sm:rounded-[1.6rem] sm:p-5 ${details ? "max-h-[calc(100dvh-1rem)] overflow-y-auto" : "max-h-44 overflow-hidden"}`}
      aria-label="Préférences de confidentialité"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 hidden size-10 shrink-0 place-items-center rounded-2xl bg-white/10 sm:grid">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold sm:text-base">Vos choix de confidentialité</p>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/72"><span className="sm:hidden">Mesure d’audience facultative. Le diagnostic reste accessible.</span><span className="hidden sm:inline">Les cookies nécessaires font fonctionner la plateforme. La mesure d’audience et la publicité restent désactivables, sans bloquer votre diagnostic.</span></p>
            </div>
            <button className="grid size-11 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white sm:size-9" onClick={() => setDetails((value) => !value)} aria-label={details ? "Fermer les réglages" : "Personnaliser les cookies"}>
              {details ? <X className="size-4" /> : <Settings2 className="size-4" />}
            </button>
          </div>

          {details ? (
            <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-3">
              <ConsentToggle label="Nécessaires" description="Sécurité, session et préférences." checked disabled onChange={() => undefined} />
              <ConsentToggle label="Mesure d’audience" description="Comprendre les parcours et améliorer les pages." checked={analytics} onChange={setAnalytics} />
              <ConsentToggle label="Publicité" description="Mesurer et optimiser les campagnes Google Ads." checked={marketing} onChange={setMarketing} />
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
            <Button size="sm" variant="dark" className="h-11 px-2 text-xs sm:h-10 sm:px-4 sm:text-[13px]" onClick={() => save(details ? { analytics, marketing } : { analytics: true, marketing: true })}>
              {details ? "Enregistrer mes choix" : "Tout autoriser"}
            </Button>
            <Button size="sm" variant="ghost" className="h-11 border border-white/15 px-2 text-xs text-white hover:bg-white/10 sm:h-10 sm:px-4 sm:text-[13px]" onClick={() => save({ analytics: false, marketing: false })}>
              Tout refuser
            </Button>
            {details ? <Link to="/confidentialite" className="inline-flex min-h-11 items-center justify-center self-center text-center text-[11px] font-medium text-white/72 underline decoration-white/25 underline-offset-4 hover:text-white sm:ml-auto sm:min-h-0 sm:text-xs">Confidentialité</Link> : null}
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

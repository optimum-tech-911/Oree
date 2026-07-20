import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ButtonLink } from "@/components/ui/Button";
import { landingPages } from "@/content/landingPages";
import { readConsent } from "@/features/consent/consent";
import { analytics } from "@/services/analytics";

export type MobileConversionConfig = {
  href: string;
  eyebrow: string;
  label: string;
  intent?: string;
};

const hiddenPrefixes = [
  "/diagnostic",
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
  "/auth",
  "/app",
  "/ops",
];

const hiddenRoutes = new Set(["/", "/rendez-vous", "/tarifs", "/offres", "/confidentialite", "/mentions-legales"]);

const contextualRoutes: Record<string, MobileConversionConfig> = {
  "/comment-ca-marche": {
    href: "/diagnostic",
    eyebrow: "Votre point de départ",
    label: "Situer mon projet",
  },
  "/accompagnement": {
    href: "/diagnostic",
    eyebrow: "Accompagnement Orée",
    label: "Décrire mon besoin",
  },
  "/choisir-statut": {
    href: "/diagnostic",
    eyebrow: "Orientation indicative",
    label: "Comparer selon mon projet",
  },
};

// Shared with the public layout and assistant so all three surfaces use exactly the same route decision.
// eslint-disable-next-line react-refresh/only-export-components
export function mobileConversionForPath(pathname: string): MobileConversionConfig | null {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (hiddenRoutes.has(normalizedPath) || hiddenPrefixes.some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))) return null;

  const landing = landingPages[normalizedPath.slice(1)];
  if (landing) {
    return {
      href: `/diagnostic?intent=${encodeURIComponent(landing.searchIntent)}`,
      eyebrow: landing.eyebrow,
      label: landing.primaryCta,
      intent: landing.searchIntent,
    };
  }

  return contextualRoutes[normalizedPath] ?? null;
}

export function MobileConversionBar() {
  const { pathname } = useLocation();
  const [consentResolved, setConsentResolved] = useState(() => Boolean(readConsent()));
  const [assistantOpen, setAssistantOpen] = useState(false);
  const config = mobileConversionForPath(pathname);

  useEffect(() => {
    const updateConsent = () => setConsentResolved(Boolean(readConsent()));
    const updateAssistant = (event: Event) => setAssistantOpen(Boolean((event as CustomEvent<{ open?: boolean }>).detail?.open));
    window.addEventListener("oree:consent-updated", updateConsent);
    window.addEventListener("oree:assistant-visibility", updateAssistant);
    return () => {
      window.removeEventListener("oree:consent-updated", updateConsent);
      window.removeEventListener("oree:assistant-visibility", updateAssistant);
    };
  }, []);

  if (!config || !consentResolved || assistantOpen) return null;

  return (
    <div className="sticky-mobile-cta fixed inset-x-0 bottom-0 z-[58] border-t border-white/10 bg-[var(--ink)]/96 px-3 pt-3 shadow-[0_-14px_40px_rgba(11,18,32,.18)] backdrop-blur-2xl lg:hidden" aria-label="Prochaine étape">
      <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] items-center gap-3">
        <div className="min-w-0 pl-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[.12em] text-white/72">{config.eyebrow}</p>
          <p className="truncate text-sm font-semibold text-white">{config.label}</p>
        </div>
        <ButtonLink
          to={config.href}
          variant="dark"
          size="sm"
          className="h-11"
          arrow
          aria-label={`${config.label} — ouvrir le diagnostic`}
          onClick={() => analytics.track("primary_cta_clicked", { path: pathname, intent: config.intent, location: "mobile_sticky" })}
        >
          Démarrer
        </ButtonLink>
      </div>
    </div>
  );
}

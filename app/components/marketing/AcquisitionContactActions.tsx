import { ArrowRight, MessageCircle, PhoneCall, RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import {
  buildWhatsAppHref,
  commercialOffers,
  type SupportedCompanyForm,
} from "@/config/commercial-offers";
import { useCompanyContact } from "@/services/phone-conversion";
import { analytics } from "@/services/analytics";
import { cn } from "@/lib/cn";

export function AcquisitionContactActions({
  diagnosticHref,
  legalForm,
  location,
  dark = false,
  phoneFirst = false,
}: {
  diagnosticHref: string;
  legalForm?: SupportedCompanyForm;
  location: string;
  dark?: boolean;
  phoneFirst?: boolean;
}) {
  const contact = useCompanyContact();
  const offer = commercialOffers.companyCreation;
  const whatsappMessage = legalForm
    ? `Bonjour, je souhaite créer une ${legalForm} avec Orée Entreprises.`
    : "Bonjour, je souhaite échanger au sujet de la création de mon entreprise.";

  const phoneLocation = phoneFirst
    ? location === "acquisition_hero" ? "hero_call" : location === "acquisition_final" ? "final_call" : location
    : location ? `${location}_call` : "other_call_cta";

  if (phoneFirst) {
    return (
      <div aria-label="Options de contact">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <a
            href={contact.phoneHref}
            data-conv="call"
            data-phone-number={contact.displayPhone}
            onClick={() => analytics.track("phone_click", { legal_form: legalForm, location: phoneLocation, cta_location: phoneLocation })}
            className="col-span-2 button-on-action inline-flex min-h-14 flex-col items-center justify-center rounded-[14px] bg-[var(--blue)] px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(36,87,255,.25)] transition hover:-translate-y-0.5 hover:brightness-95 sm:col-span-1"
          >
            <span className="inline-flex items-center gap-2"><PhoneCall className="size-4" />Appeler maintenant</span>
            <span className="mt-0.5 text-[11px] text-white/78">{contact.displayPhone} · 7j/7</span>
          </a>
          <a
            href="#rappel"
            onClick={() => analytics.track("primary_cta_clicked", { legal_form: legalForm, location, intent: "callback" })}
            className={cn("col-span-1 inline-flex min-h-12 sm:min-h-14 items-center justify-center gap-1.5 sm:gap-2 rounded-[14px] border px-2 sm:px-5 text-xs sm:text-sm font-semibold transition hover:-translate-y-0.5", dark ? "border-white/24 bg-white text-[color:var(--ink)] hover:bg-[var(--paper)]" : "border-[var(--line-strong)] bg-white text-[color:var(--ink)] hover:border-[var(--blue)]/45")}
          >
            <RotateCcw className="size-3.5 sm:size-4 shrink-0" /><span>{offer.callbackCtaLabel}</span>
          </a>
          <ButtonLink
            to={diagnosticHref}
            variant="ghost"
            className={cn("col-span-1 min-h-12 sm:min-h-14 w-full rounded-[14px] px-2 sm:px-4 text-xs sm:text-sm", dark && "border border-white/18 bg-transparent text-white hover:bg-white/[.08]")}
            onClick={() => analytics.track("primary_cta_clicked", { legal_form: legalForm, location, intent: "company_creation" })}
          >
            <span>Commencer mon dossier</span><ArrowRight className="size-3.5 sm:size-4 shrink-0" />
          </ButtonLink>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className={cn("text-xs leading-relaxed", dark ? "text-white/80" : "text-[color:var(--muted)]")}>
            7j/7 de 7h à 20h. C’est Sof qui décroche, pas un standard.
          </p>
          <a
            href={buildWhatsAppHref(undefined, whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            onClick={() => analytics.track("whatsapp_click", { legal_form: legalForm, location })}
            className={cn("inline-flex items-center gap-2 text-xs font-semibold transition", dark ? "text-white/72 hover:text-white" : "text-[color:var(--muted)] hover:text-[color:var(--ink)]")}
          >
            <MessageCircle className="size-4" />Écrire sur WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Actions du parcours">
      <ButtonLink
        to={diagnosticHref}
        variant={dark ? "accent" : "primary"}
        size="lg"
        className="button-on-action"
        onClick={() => analytics.track("primary_cta_clicked", { legal_form: legalForm, location, intent: "company_creation" })}
      >
        {offer.ctaLabel}<ArrowRight className="size-4" />
      </ButtonLink>
      <a
        href="#rappel"
        onClick={() => analytics.track("primary_cta_clicked", { legal_form: legalForm, location, intent: "callback" })}
        className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition hover:-translate-y-0.5", dark ? "border-white/16 bg-white/[.06] text-white hover:bg-white/[.1]" : "border-[var(--line)] bg-white text-[color:var(--ink)] hover:border-[var(--blue)]/35")}
      >
        <RotateCcw className="size-4" />{offer.callbackCtaLabel}
      </a>
      <a
        href={contact.phoneHref}
        data-conv="call"
        data-phone-number={contact.displayPhone}
        aria-label={`Appeler Orée au ${contact.displayPhone}`}
        onClick={() => analytics.track("phone_click", { legal_form: legalForm, location: phoneLocation, cta_location: phoneLocation })}
        className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition hover:-translate-y-0.5", dark ? "border-white/16 bg-white/[.06] text-white hover:bg-white/[.1]" : "border-[var(--line)] bg-white text-[color:var(--ink)] hover:border-[var(--blue)]/35")}
      >
        <PhoneCall className="size-4" />Appeler
      </a>
      <a
        href={buildWhatsAppHref(undefined, whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        onClick={() => analytics.track("whatsapp_click", { legal_form: legalForm, location })}
        className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition hover:-translate-y-0.5", dark ? "border-[var(--mint)]/35 bg-[var(--mint)] text-[color:var(--ink)] hover:bg-[var(--mint)]/90" : "border-[var(--mint)]/40 bg-[var(--mint-soft)] text-[color:var(--ink)]")}
      >
        <MessageCircle className="size-4" />Écrire sur WhatsApp
      </a>
    </div>
  );
}

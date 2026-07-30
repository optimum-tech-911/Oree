import { ArrowRight, MessageCircle, PhoneCall, RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import {
  buildPhoneHref,
  buildWhatsAppHref,
  commercialOffers,
  type SupportedCompanyForm,
} from "@/config/commercial-offers";
import { analytics } from "@/services/analytics";
import { cn } from "@/lib/cn";

export function AcquisitionContactActions({
  diagnosticHref,
  legalForm,
  location,
  dark = false,
}: {
  diagnosticHref: string;
  legalForm?: SupportedCompanyForm;
  location: string;
  dark?: boolean;
}) {
  const offer = commercialOffers.companyCreation;
  const whatsappMessage = legalForm
    ? `Bonjour, je souhaite créer une ${legalForm} avec Orée Entreprises.`
    : "Bonjour, je souhaite échanger au sujet de la création de mon entreprise.";

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Options de contact">
      <ButtonLink
        to={diagnosticHref}
        variant="accent"
        className="w-full"
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
        href={buildPhoneHref()}
        onClick={() => analytics.track("phone_click", { legal_form: legalForm, location })}
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

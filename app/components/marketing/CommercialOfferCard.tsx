import { useEffect } from "react";
import { Check, CircleAlert, ReceiptText } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  commercialOffers,
  companyOfferHeadline,
  type SupportedCompanyForm,
} from "@/config/commercial-offers";
import { analytics } from "@/services/analytics";
import { cn } from "@/lib/cn";

type CompanyOfferCardProps = {
  form?: SupportedCompanyForm;
  compact?: boolean;
  trackingLocation: string;
  ctaHref?: string;
  className?: string;
  showCta?: boolean;
};

export function CompanyOfferCard({
  form,
  compact = false,
  trackingLocation,
  ctaHref = "/diagnostic",
  className,
  showCta = true,
}: CompanyOfferCardProps) {
  const offer = commercialOffers.companyCreation;

  useEffect(() => {
    analytics.trackOnce("pricing_viewed", `${window.location.pathname}:${offer.id}:${trackingLocation}`, {
      path: window.location.pathname,
      offer: offer.id,
      legal_form: form,
      location: trackingLocation,
      value: offer.price,
      currency: "EUR",
    });
  }, [form, offer.id, offer.price, trackingLocation]);

  return (
    <article
      data-commercial-offer={offer.id}
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-[0_24px_72px_rgba(11,18,32,.09)]",
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8 lg:p-10",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--blue)]" />
      <div className={cn("grid gap-7", !compact && "lg:grid-cols-[.82fr_1.18fr] lg:gap-12")}>
        <div>
          <Badge><ReceiptText className="size-3.5" />Prix fixe confirmé</Badge>
          <h2 className={cn("mt-5 text-balance font-semibold leading-[1] tracking-[-.05em]", compact ? "text-3xl" : "text-4xl sm:text-5xl")}>
            {form ? companyOfferHeadline(form) : offer.title}
          </h2>
          {!form ? <p className={cn("mt-3 font-semibold text-[color:var(--blue)]", compact ? "text-3xl" : "text-4xl sm:text-5xl")}>{offer.priceLabel}</p> : null}
          <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">{offer.description}</p>
          <p className="mt-4 rounded-[16px] bg-[var(--mint-soft)] px-4 py-3 text-xs font-semibold leading-5">{offer.paymentStage}</p>
          {showCta ? <ButtonLink
            to={ctaHref}
            variant="accent"
            size={compact ? "md" : "lg"}
            className="mt-6 w-full sm:w-auto"
            arrow
            onClick={() => analytics.track("primary_cta_clicked", {
              path: window.location.pathname,
              offer: offer.id,
              legal_form: form,
              location: trackingLocation,
            })}
          >
            {offer.ctaLabel}
          </ButtonLink> : null}
        </div>
        <div className={cn("rounded-[22px] bg-[var(--ink)] text-white", compact ? "p-5" : "p-6 sm:p-7")}>
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--mint)]">Tout ce qui est inclus</p>
          <ul className="mt-5 space-y-3">
            {offer.included.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-white/82">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-3" /></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-[color:var(--mint)]" />
            <p className="text-xs leading-6 text-white/72">{offer.restriction}</p>
          </div>
          {offer.tax.visible && offer.tax.publicLabel ? <p className="mt-3 text-xs text-white/72">{offer.tax.publicLabel}</p> : null}
        </div>
      </div>
    </article>
  );
}

export function MicroEnterpriseOfferCard({ trackingLocation }: { trackingLocation: string }) {
  const offer = commercialOffers.microEnterprise;

  useEffect(() => {
    analytics.trackOnce("pricing_viewed", `${window.location.pathname}:${offer.id}:${trackingLocation}`, {
      path: window.location.pathname,
      offer: offer.id,
      location: trackingLocation,
      value: offer.price,
      currency: "EUR",
    });
  }, [offer.id, offer.price, trackingLocation]);

  return (
    <article data-commercial-offer={offer.id} className="rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-6">
      <Badge>Offre distincte</Badge>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-.035em]">{offer.title}</h3>
      <p className="mt-3 text-4xl font-semibold tracking-[-.05em]">{offer.priceLabel}</p>
      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{offer.description}</p>
      <ButtonLink
        to="/diagnostic?intent=micro_creation"
        variant="secondary"
        className="mt-6"
        onClick={() => analytics.track("primary_cta_clicked", {
          path: window.location.pathname,
          offer: offer.id,
          location: trackingLocation,
        })}
      >
        {offer.ctaLabel}
      </ButtonLink>
    </article>
  );
}

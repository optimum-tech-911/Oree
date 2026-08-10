import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { usePageMeta } from "@/hooks/usePageMeta";
import { commercialOffers, buildPhoneHref, buildEmailHref } from "@/config/commercial-offers";

export default function ContactPage() {
  usePageMeta("Contact", "Contacter l'équipe Orée Entreprises.");

  return (
    <>
      <section className="hero-grid surface-noise overflow-hidden bg-[var(--night)] pb-18 pt-34 text-white sm:pt-42 lg:pb-24 lg:pt-44">
        <div className="container-shell relative z-10 max-w-5xl">
          <Badge className="border-white/12 bg-white/[.06] text-white/68">Contact</Badge>
          <div className="mt-7">
            <h1 className="text-balance text-[clamp(3.5rem,7vw,7.8rem)] font-semibold leading-[.9] tracking-[-.075em]">Nous contacter</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              Une question ? Besoin d'aide pour avancer sur votre projet ? Notre équipe est disponible pour vous accompagner.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-28 pt-16 sm:pt-20">
        <div className="container-shell max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <a href={buildPhoneHref()} className="group interactive-card soft-panel block rounded-[28px] p-6 sm:p-8">
              <span className="grid size-13 place-items-center rounded-[19px] bg-[var(--blue)]/10 text-[color:var(--blue)]">
                <Phone className="size-6" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-[-.03em] sm:text-2xl">Par téléphone</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Appelez Sof directement, 7j/7 de 7h à 20h.</p>
              <p className="mt-5 text-2xl font-semibold tracking-[-.03em] group-hover:text-[color:var(--blue)] transition">{commercialOffers.contact.displayPhone}</p>
            </a>
            
            <a href={buildEmailHref()} className="group interactive-card soft-panel block rounded-[28px] p-6 sm:p-8">
              <span className="grid size-13 place-items-center rounded-[19px] bg-[var(--mint-soft)]">
                <Mail className="size-6 text-[color:var(--ink)]" />
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-[-.03em] sm:text-2xl">Par email</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Écrivez-nous à tout moment, nous vous répondrons rapidement.</p>
              <p className="mt-5 text-xl font-semibold tracking-[-.03em] group-hover:text-[color:var(--blue)] transition break-all">{commercialOffers.contact.email}</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

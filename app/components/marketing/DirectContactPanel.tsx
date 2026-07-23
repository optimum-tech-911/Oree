import { motion, useReducedMotion } from "motion/react";
import { Mail, MessageCircle, MessageSquareText, PhoneCall, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { analytics } from "@/services/analytics";
import { cn } from "@/lib/cn";

const phone = "+33787823208";
const displayPhone = "+33 7 87 82 32 08";
const email = "sebaasofiene@gmail.com";
const message = "Bonjour, j’ai une question au sujet de la création de mon entreprise.";

const options = [
  {
    id: "call",
    label: "Appeler",
    description: "Parler directement à l’équipe.",
    href: `tel:${phone}`,
    icon: PhoneCall,
    tone: "bg-[var(--action)] text-white shadow-[0_14px_34px_rgba(36,87,255,.2)]",
    external: false,
  },
  {
    id: "sms",
    label: "Envoyer un SMS",
    description: "Poser une question en quelques mots.",
    href: `sms:${phone}?body=${encodeURIComponent(message)}`,
    icon: MessageSquareText,
    tone: "bg-white text-[color:var(--ink)]",
    external: false,
  },
  {
    id: "email",
    label: "Écrire par e-mail",
    description: "Envoyer une demande plus détaillée.",
    href: `mailto:${email}?subject=${encodeURIComponent("Demande depuis Orée Entreprises")}&body=${encodeURIComponent(message)}`,
    icon: Mail,
    tone: "bg-white text-[color:var(--ink)]",
    external: false,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Continuer la conversation dans WhatsApp.",
    href: `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(message)}`,
    icon: MessageCircle,
    tone: "bg-[var(--mint-soft)] text-[color:var(--ink)]",
    external: true,
  },
  {
    id: "whatsapp-business",
    label: "WhatsApp Business",
    description: "Ouvrir l’échange côté professionnel.",
    href: `https://api.whatsapp.com/send?phone=${phone.slice(1)}&text=${encodeURIComponent(message)}`,
    icon: Send,
    tone: "bg-[var(--ink)] text-white",
    external: true,
  },
] as const;

export function DirectContactPanel() {
  const reduce = useReducedMotion();

  return (
    <div id="contact" data-direct-contact className="relative overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_24px_72px_rgba(11,18,32,.08)] sm:p-8 lg:p-10">
      <div className="absolute inset-0 hero-grid opacity-[.035]" />
      <div className="relative grid gap-7 lg:grid-cols-[.78fr_1.22fr] lg:gap-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .28 }}
          transition={{ duration: .6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[24px] bg-[var(--ink)] p-6 text-white sm:p-8"
        >
          <Badge className="border-white/10 bg-white/[.07] text-white/72">Parler à l’équipe</Badge>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[.98] tracking-[-.05em] sm:text-5xl">Choisissez le canal qui vous semble <span className="editorial-mark text-[color:var(--mint)]">le plus simple.</span></h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base">Un appel pour aller droit au but, un message pour répondre à votre rythme, ou un e-mail si votre demande mérite davantage de contexte.</p>
          <dl className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
            <div><dt className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/52">Téléphone</dt><dd className="mt-1 font-semibold text-white">{displayPhone}</dd></div>
            <div><dt className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/52">E-mail</dt><dd className="mt-1 break-all font-semibold text-white">{email}</dd></div>
          </dl>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => {
            const Icon = option.icon;
            const isPrimary = option.id === "call";
            return (
              <motion.a
                key={option.id}
                href={option.href}
                target={option.external ? "_blank" : undefined}
                rel={option.external ? "noreferrer" : undefined}
                onClick={() => analytics.track("contact_option_selected", { channel: option.id, location: "home_contact" })}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .22 }}
                transition={{ duration: .48, delay: reduce ? 0 : .1 + index * .055, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-[20px] border border-[var(--line)] p-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-[var(--action)]/35 hover:shadow-[0_18px_38px_rgba(11,18,32,.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action)] focus-visible:ring-offset-2 sm:min-h-40",
                  option.tone,
                  isPrimary && "sm:col-span-2 sm:min-h-32 sm:flex-row sm:items-center sm:gap-6",
                )}
              >
                <span className={cn("grid size-11 place-items-center rounded-[15px] transition duration-300 group-hover:scale-110", isPrimary ? "bg-white text-[color:var(--ink)]" : "bg-[var(--ink)]/[.06] text-[color:var(--ink)]", option.id === "whatsapp-business" && "bg-white/10 text-white")}><Icon className="size-5" aria-hidden="true" /></span>
                <span className={cn("mt-5 block", isPrimary && "sm:mt-0 sm:flex-1")}><span className="block text-base font-semibold tracking-[-.025em]">{option.label}</span><span className={cn("mt-1.5 block text-xs leading-5", isPrimary || option.id === "whatsapp-business" ? "text-white/72" : "text-[color:var(--muted)]")}>{option.description}</span></span>
                <span className={cn("absolute -right-4 -top-7 text-7xl font-semibold tracking-[-.1em] transition duration-500 group-hover:translate-x-[-.35rem]", isPrimary || option.id === "whatsapp-business" ? "text-white/[.08]" : "text-[color:var(--ink)]/[.045]")}>{String(index + 1).padStart(2, "0")}</span>
              </motion.a>
            );
          })}
        </div>
      </div>
      <p className="relative mt-5 text-xs leading-5 text-[color:var(--muted)]">WhatsApp et WhatsApp Business ouvrent l’application disponible sur votre appareil ou WhatsApp Web sur ordinateur.</p>
    </div>
  );
}

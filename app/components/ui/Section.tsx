import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

export function Section({ className, ...props }: HTMLMotionProps<"section">) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className={cn("relative py-20 sm:py-24 lg:py-30 xl:py-36", className)}
      data-section-reveal
      initial={reduce ? false : { opacity: .64, y: 42 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .08, margin: "0px 0px -5% 0px" }}
      transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    />
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div className={cn("mb-10 flex gap-7 lg:mb-16", align === "center" ? "mx-auto max-w-4xl flex-col items-center text-center" : "items-end justify-between") }>
      <div className={cn("max-w-4xl", align === "center" && "flex flex-col items-center") }>
        {eyebrow ? <Badge className="mb-5">{eyebrow}</Badge> : null}
        <h2 className="text-balance text-[clamp(2.25rem,4.5vw,5.2rem)] font-semibold leading-[1.02] tracking-[-.045em] text-[color:var(--ink)]">{title}</h2>
        {description ? <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[color:var(--muted)] sm:text-lg sm:leading-8">{description}</p> : null}
      </div>
      {action ? <div className="hidden shrink-0 lg:block">{action}</div> : null}
    </div>
  );
}

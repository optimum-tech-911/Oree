import { motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/ui/Logo";

export function PageLoader() {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="hero-grid grid min-h-screen place-items-center overflow-hidden bg-[var(--ink)] px-6 text-white" role="status" aria-live="polite" data-page-loader>
      <div className="relative w-full max-w-sm text-center">
        <div className="mx-auto w-fit"><Logo inverted /></div>
        <div className="relative mx-auto mt-10 size-20">
          <motion.span className="absolute inset-0 rounded-full border border-white/16" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 2.8, ease: "linear", repeat: Infinity }} />
          <motion.span className="absolute inset-2 rounded-full border-2 border-transparent border-r-[var(--action)] border-t-[var(--mint)]" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 1.4, ease: "linear", repeat: Infinity }} />
          <span className="absolute inset-0 grid place-items-center"><span className="size-2 rounded-full bg-[var(--mint)] shadow-[0_0_20px_var(--mint)]" /></span>
        </div>
        <p className="mt-7 text-sm font-semibold text-white">Préparation de votre espace…</p>
        <p className="mt-2 text-xs leading-5 text-white/62">Chargement sécurisé des contenus et de votre prochaine action.</p>
        <div className="mt-7 grid grid-cols-3 gap-2" aria-hidden="true">
          {[0, 1, 2].map((item) => <span key={item} className="h-1 overflow-hidden rounded-full bg-white/10"><motion.span className="block h-full rounded-full bg-[var(--mint)]" initial={reduce ? { width: "100%" } : { width: "0%" }} animate={{ width: "100%" }} transition={{ duration: .75, delay: item * .18, ease: [0.22, 1, 0.36, 1] }} /></span>)}
        </div>
      </div>
    </motion.div>
  );
}

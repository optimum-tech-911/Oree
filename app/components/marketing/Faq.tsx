import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

export function Faq({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-[var(--line)] rounded-[30px] border border-[var(--line)] bg-white px-5 sm:px-8">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.question}>
            <button type="button" onClick={() => setOpen(active ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7" aria-expanded={active}>
              <span className="text-base font-semibold tracking-[-.02em] sm:text-lg">{item.question}</span>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full border border-[var(--line)] transition", active && "rotate-45 bg-[var(--ink)] text-white")}><Plus className="size-4" /></span>
            </button>
            <AnimatePresence initial={false}>
              {active ? <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><p className="max-w-3xl pb-7 text-sm leading-7 text-[color:var(--muted)] sm:text-base">{item.answer}</p></motion.div> : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

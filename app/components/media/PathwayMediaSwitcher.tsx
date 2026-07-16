import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ImageryAsset } from "@/content/imagery";
import { ArtDirectedPicture } from "./ArtDirectedPicture";

export type PathwayMediaItem = {
  id: string;
  title: string;
  short: string;
  description: string;
  href: string;
  action: string;
  points: string[];
  asset: ImageryAsset;
};

export function PathwayMediaSwitcher({ item }: { item: PathwayMediaItem }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-[580px] overflow-hidden rounded-[34px] border border-[var(--line)] bg-[var(--ink)] text-white shadow-[0_28px_90px_rgba(11,18,32,.18)] sm:min-h-[620px]">
      <AnimatePresence mode="wait">
        <motion.div key={item.id} initial={reduce ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: .36 }} className="absolute inset-0">
          <ArtDirectedPicture asset={item.asset} sizes="(max-width: 1023px) 100vw, 62vw" className="size-full" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,.05)_0%,rgba(11,18,32,.28)_38%,rgba(11,18,32,.97)_100%)]" />
      <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/12 bg-[var(--ink)]/68 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[.13em] text-white/68 backdrop-blur-lg"><span className="size-1.5 rounded-full bg-[var(--mint)]" />Situation illustrative</div>
      <AnimatePresence mode="wait">
        <motion.div key={`${item.id}-copy`} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .32 }} aria-live="polite" className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-9">
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[color:var(--mint)]">{item.short}</p>
          <h3 className="mt-3 max-w-2xl text-balance text-4xl font-extrabold leading-[.98] tracking-[-.065em] sm:text-5xl">{item.title}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64 sm:text-base">{item.description}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">{item.points.map((point, index) => <div key={point} className="rounded-[16px] border border-white/10 bg-white/[.065] p-3 backdrop-blur-md"><span className="text-[9px] font-extrabold text-[color:var(--mint)]">0{index + 1}</span><p className="mt-2 text-xs font-extrabold leading-5 text-white/82">{point}</p></div>)}</div>
          <Link to={item.href} className="group mt-5 inline-flex h-12 items-center gap-3 rounded-[14px] bg-[var(--action)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(36,87,255,.24)] transition hover:-translate-y-0.5 hover:brightness-[.94]">{item.action}<ArrowRight className="size-4 transition group-hover:translate-x-1" /></Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

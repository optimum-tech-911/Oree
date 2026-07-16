import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ImageryAsset } from "@/content/imagery";
import { ArtDirectedPicture } from "./ArtDirectedPicture";

export function ProcessMediaPanel({ asset, visible }: { asset: ImageryAsset; visible: boolean }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {visible ? <motion.figure initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} className="absolute right-6 top-16 w-32 overflow-hidden rounded-[18px] border border-white/80 bg-white p-1 shadow-[0_18px_50px_rgba(11,18,32,.16)] sm:right-8 sm:top-18 sm:w-44"><ArtDirectedPicture asset={asset} sizes="176px" className="aspect-[4/3] rounded-[14px]" /><figcaption className="px-2 py-2 text-[8px] font-extrabold uppercase tracking-[.11em] text-[color:var(--muted)]">Contrôle illustratif</figcaption></motion.figure> : null}
    </AnimatePresence>
  );
}

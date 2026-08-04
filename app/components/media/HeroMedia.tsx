import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ImageryAsset } from "@/content/imagery";
import { cn } from "@/lib/cn";
import { ArtDirectedPicture } from "./ArtDirectedPicture";

export function HeroMedia({ asset, children, className, contentClassName, compact = false }: { asset: ImageryAsset; children?: ReactNode; className?: string; contentClassName?: string; compact?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={compact || reduce ? false : { opacity: 0, x: 24, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: .16, duration: .82, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden border border-white/18 shadow-[0_34px_100px_rgba(11,18,32,.3)]",
        compact ? "min-h-[390px] rounded-[22px] sm:min-h-[510px] lg:min-h-[570px]" : "min-h-[590px] rounded-[32px] sm:min-h-[650px]",
        className,
      )}
    >
      <motion.div className="absolute inset-0" animate={reduce ? undefined : { scale: [1, 1.025, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}>
        <ArtDirectedPicture asset={asset} sizes="(max-width: 767px) 94vw, (max-width: 1279px) 58vw, 680px" className="size-full" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,.03)_0%,rgba(11,18,32,.12)_43%,rgba(11,18,32,.8)_100%)]" />
      <div className={cn("relative z-10 flex items-end", compact ? "min-h-[390px] p-0 sm:min-h-[510px] lg:min-h-[570px]" : "min-h-[590px] p-3 sm:min-h-[650px] sm:p-4", contentClassName)}>{children}</div>
    </motion.div>
  );
}

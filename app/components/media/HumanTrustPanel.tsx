import { Check } from "lucide-react";
import type { ImageryAsset } from "@/content/imagery";
import { ArtDirectedPicture } from "./ArtDirectedPicture";

export function HumanTrustPanel({ asset, points }: { asset: ImageryAsset; points: string[] }) {
  return (
    <figure className="relative min-h-[600px] overflow-hidden rounded-[38px] border border-white/12 shadow-[0_46px_130px_rgba(11,18,32,.34)]">
      <ArtDirectedPicture asset={asset} sizes="(max-width: 767px) 100vw, 620px" className="absolute inset-0 size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,.04),rgba(11,18,32,.24)_42%,rgba(11,18,32,.96))]" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[color:var(--mint)]">Scène illustrative · accompagnement humain</p>
        <div className="mt-4 grid gap-2">{points.map((point) => <div key={point} className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[.07] p-3 text-sm font-bold text-white/78 backdrop-blur-md"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-3.5" /></span>{point}</div>)}</div>
      </figcaption>
    </figure>
  );
}

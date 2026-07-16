import type { ReactNode } from "react";
import type { ImageryAsset } from "@/content/imagery";
import { ArtDirectedPicture } from "./ArtDirectedPicture";

export function EditorialMediaCard({ asset, eyebrow, title, children }: { asset: ImageryAsset; eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <figure className="group overflow-hidden rounded-[30px] border border-[var(--line)] bg-white shadow-[0_24px_70px_rgba(11,18,32,.1)]">
      <ArtDirectedPicture asset={asset} sizes="(max-width: 767px) 100vw, 560px" className="aspect-[4/3]" imageClassName="transition duration-700 group-hover:scale-[1.025]" />
      <figcaption className="p-5 sm:p-6"><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[color:var(--blue)]">{eyebrow}</p><h3 className="mt-3 text-xl font-extrabold tracking-[-.035em]">{title}</h3>{children}</figcaption>
    </figure>
  );
}

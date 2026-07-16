import type { ReactNode } from "react";
import type { ImageryAsset } from "@/content/imagery";
import { ArtDirectedPicture } from "./ArtDirectedPicture";

export function AppEmptyState({ asset, title, description, action }: { asset?: ImageryAsset; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="grid items-center gap-5 rounded-[28px] border border-[var(--line)] bg-white p-5 sm:grid-cols-[160px_1fr] sm:p-6">
      {asset ? <ArtDirectedPicture asset={asset} sizes="160px" className="aspect-[4/3] rounded-[20px]" /> : null}
      <div><h3 className="text-lg font-extrabold tracking-[-.03em]">{title}</h3><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{description}</p>{action ? <div className="mt-4">{action}</div> : null}</div>
    </div>
  );
}

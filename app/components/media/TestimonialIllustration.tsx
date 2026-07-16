import type { ImageryAsset } from "@/content/imagery";
import { EditorialMediaCard } from "./EditorialMediaCard";

export function TestimonialIllustration({ asset, title, description }: { asset: ImageryAsset; title: string; description: string }) {
  return <EditorialMediaCard asset={asset} eyebrow="Situation illustrative" title={title}><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p></EditorialMediaCard>;
}

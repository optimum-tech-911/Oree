import type { HTMLAttributes } from "react";
import type { ImageryAsset } from "@/content/imagery";
import { cn } from "@/lib/cn";
import { ResponsiveImage } from "./ResponsiveImage";

type ArtDirectedPictureProps = HTMLAttributes<HTMLDivElement> & {
  asset: ImageryAsset;
  sizes?: string;
  imageClassName?: string;
  onImageLoad?: () => void;
};

export function ArtDirectedPicture({ asset, sizes, className, imageClassName, onImageLoad, ...props }: ArtDirectedPictureProps) {
  return (
    <div {...props} className={cn("relative overflow-hidden bg-[var(--ink-2)]", className)}>
      <ResponsiveImage
        asset={asset}
        sizes={sizes}
        pictureClassName="absolute inset-0 size-full"
        className={cn("size-full object-cover", imageClassName)}
        onLoad={onImageLoad}
      />
    </div>
  );
}

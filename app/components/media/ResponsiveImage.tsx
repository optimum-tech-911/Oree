import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { ImageSource, ImageryAsset } from "@/content/imagery";
import { cn } from "@/lib/cn";

function srcSet(items: ImageSource[]) {
  return items.map((item) => `${item.src} ${item.width}w`).join(", ");
}

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height" | "alt" | "loading"> & {
  asset: ImageryAsset;
  sizes?: string;
  pictureClassName?: string;
};

export function ResponsiveImage({ asset, sizes = "100vw", className, pictureClassName, style, ...props }: ResponsiveImageProps) {
  const imageStyle = { objectPosition: asset.focalPosition, ...style } as CSSProperties;

  return (
    <picture className={cn("block", pictureClassName)}>
      {asset.mobile ? <source media="(max-width: 767px)" type="image/avif" srcSet={srcSet(asset.mobile.sources.avif)} sizes={sizes} /> : null}
      <source type="image/avif" srcSet={srcSet(asset.sources.avif)} sizes={sizes} />
      {asset.mobile ? <source media="(max-width: 767px)" type="image/webp" srcSet={srcSet(asset.mobile.sources.webp)} sizes={sizes} /> : null}
      <source type="image/webp" srcSet={srcSet(asset.sources.webp)} sizes={sizes} />
      <img
        {...props}
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        loading={asset.loading}
        decoding="async"
        fetchPriority={asset.fetchPriority}
        className={cn("block max-w-full", className)}
        style={imageStyle}
      />
    </picture>
  );
}

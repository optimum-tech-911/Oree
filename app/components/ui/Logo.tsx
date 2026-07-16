import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

type LogoProps = {
  compact?: boolean;
  inverted?: boolean;
  variant?: "horizontal" | "full";
  className?: string;
};

export function Logo({ compact = false, inverted = false, variant = "horizontal", className }: LogoProps) {
  const source = compact
    ? "/assets/brand/oree-app-icon.webp"
    : variant === "full"
      ? "/assets/brand/oree-lockup-complet.webp"
      : "/assets/brand/oree-entreprises-horizontal.webp";

  return (
    <Link
      to="/"
      className={cn("brand-logo group inline-flex shrink-0 items-center", className)}
      aria-label="Orée Entreprises, accueil"
      data-brand-logo={variant}
    >
      <img
        src={source}
        alt=""
        width={compact ? 64 : variant === "full" ? 260 : 224}
        height={compact ? 64 : variant === "full" ? 132 : 39}
        className={cn(
          "brand-logo-image object-contain transition duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.025]",
          compact ? "size-10 rounded-[13px]" : variant === "full" ? "h-auto w-[205px] sm:w-[240px]" : "h-auto w-[126px] sm:w-[180px] xl:w-[200px]",
          inverted ? "brand-logo-inverted" : "brand-logo-on-canvas",
        )}
      />
    </Link>
  );
}

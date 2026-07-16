import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "soft" | "accent";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "button-on-action button-sheen border border-[var(--action)] bg-[var(--action)] text-white shadow-[0_14px_36px_rgba(36,87,255,.22)] hover:-translate-y-1 hover:brightness-[.94] hover:shadow-[0_22px_50px_rgba(36,87,255,.3)]",
  secondary: "button-on-light border border-[var(--line-strong)] bg-[var(--canvas)] text-[color:var(--ink)] shadow-[0_8px_24px_rgba(11,18,32,.05)] hover:-translate-y-1 hover:border-[var(--action)]/40 hover:shadow-[0_16px_38px_rgba(11,18,32,.1)]",
  ghost: "border border-transparent text-[color:var(--ink)] hover:border-[var(--line)] hover:bg-[var(--ink)]/[.04]",
  dark: "button-on-action button-sheen border border-[var(--action)] bg-[var(--action)] text-white shadow-[0_14px_38px_rgba(36,87,255,.28)] hover:-translate-y-1 hover:brightness-[.96] hover:shadow-[0_22px_52px_rgba(36,87,255,.3)]",
  soft: "button-on-light border border-[var(--mint)]/45 bg-[var(--mint-soft)] text-[color:var(--ink)] hover:-translate-y-1 hover:border-[var(--mint)]",
  accent: "button-on-action button-sheen border border-[var(--action)] bg-[var(--action)] text-white shadow-[0_14px_36px_rgba(36,87,255,.24)] hover:-translate-y-1 hover:brightness-[.94] hover:shadow-[0_22px_50px_rgba(36,87,255,.3)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 rounded-xl px-4 text-[13px]",
  md: "h-12 rounded-[14px] px-5 text-sm",
  lg: "h-14 rounded-2xl px-6 text-[15px] sm:h-14 sm:px-7",
  icon: "size-11 rounded-full",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  externalArrow?: boolean;
};

const base = "group inline-flex items-center justify-center gap-2.5 font-semibold tracking-[-.01em] transition duration-300 ease-out active:translate-y-0 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45";

function Arrow({ external = false }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return <Icon className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", arrow = false, externalArrow = false, children, ...props },
  ref,
) {
  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}{arrow || externalArrow ? <Arrow external={externalArrow} /> : null}</span>
    </button>
  );
});

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  arrow = false,
  externalArrow = false,
  children,
  ...props
}: LinkProps & { variant?: Variant; size?: Size; arrow?: boolean; externalArrow?: boolean }) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}{arrow || externalArrow ? <Arrow external={externalArrow} /> : null}</span>
    </Link>
  );
}

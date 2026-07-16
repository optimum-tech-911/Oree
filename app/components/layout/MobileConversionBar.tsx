import { useLocation } from "react-router-dom";
import { ButtonLink } from "@/components/ui/Button";

const hiddenPrefixes = ["/diagnostic", "/connexion", "/inscription", "/auth/", "/app", "/ops"];

export function MobileConversionBar() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) return null;
  return (
    <div className="sticky-mobile-cta fixed inset-x-0 bottom-0 z-[58] border-t border-white/10 bg-[var(--ink)]/92 px-3 pt-3 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] items-center gap-3">
        <div className="min-w-0 pl-1"><p className="truncate text-[11px] font-extrabold uppercase tracking-[.12em] text-white/72">Orientation offerte</p><p className="truncate text-sm font-bold text-white">Situez votre projet en 3 minutes</p></div>
        <ButtonLink to="/diagnostic" variant="dark" size="sm" arrow>Commencer</ButtonLink>
      </div>
    </div>
  );
}

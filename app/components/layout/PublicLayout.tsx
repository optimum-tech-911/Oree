import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AmbientPointer } from "@/components/layout/AmbientPointer";
import { MobileConversionBar } from "@/components/layout/MobileConversionBar";

const darkHeroRoutes = new Set(["/", "/creation-sasu", "/creation-eurl", "/creation-sas", "/creation-sarl", "/creer-entreprise-en-etant-salarie", "/passer-micro-entreprise-en-societe", "/creer-entreprise-a-plusieurs", "/dossier-creation-entreprise-bloque"]);

export function PublicLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <div className="relative min-h-screen bg-[var(--paper)] text-[color:var(--ink)]">
      <ScrollToTop />
      <AmbientPointer />
      <PublicHeader transparent={darkHeroRoutes.has(location.pathname)} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[1]"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <PublicFooter />
      <MobileConversionBar />
    </div>
  );
}

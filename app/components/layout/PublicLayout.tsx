import { Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AmbientPointer } from "@/components/layout/AmbientPointer";
import { MobileConversionBar, mobileConversionForPath } from "@/components/layout/MobileConversionBar";
import { ContactLauncher } from "@/components/marketing/ContactLauncher";

const darkHeroRoutes = new Set(["/", "/creation-sasu", "/creation-eurl", "/creation-sas", "/creation-sarl", "/creer-entreprise-seul", "/creer-entreprise-en-etant-salarie", "/creer-entreprise-demandeur-emploi", "/passer-micro-entreprise-en-societe", "/creer-entreprise-a-plusieurs", "/dossier-creation-entreprise-bloque"]);

export function PublicLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const normalizedPath = location.pathname.length > 1 ? location.pathname.replace(/\/+$/, "") : location.pathname;
  const hasMobileConversion = Boolean(mobileConversionForPath(location.pathname));
  // Le rendu initial doit correspondre au HTML prérendu : on n'anime qu'à partir
  // du premier changement de route. React Router marque l'entrée initiale de
  // l'historique avec la clé "default" et attribue une clé unique à chaque
  // navigation client.
  const animateEntrance = !reduce && location.key !== "default";
  return (
    <div className={`relative min-h-screen bg-[var(--paper)] text-[color:var(--ink)] ${hasMobileConversion ? "pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0" : ""}`}>
      <ScrollToTop />
      <AmbientPointer />
      <PublicHeader transparent={darkHeroRoutes.has(normalizedPath)} />
      {/* Frontière locale : les pages publiques sont chargées en lazy. Sans elle, la
          suspension remonte jusqu'au Suspense de App et affiche le PageLoader plein
          écran à chaque navigation. Ici, l'en-tête reste en place et React conserve
          la page courante jusqu'à l'arrivée du chunk suivant. */}
      <Suspense fallback={<div className="min-h-[70vh]" aria-hidden="true" />}>
        {/* Pas d'AnimatePresence ici : le nœud maintenu pour jouer l'animation de
            sortie contient <Outlet />, qui suit le contexte de route et rend donc
            immédiatement la page entrante. Celle-ci héritait de l'animation de
            sortie et restait bloquée à opacity: 0 — la « page blanche ». */}
        <motion.main
          key={location.pathname}
          initial={animateEntrance ? { opacity: 0, y: 18, filter: "blur(5px)" } : false}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[1]"
        >
          <Outlet />
        </motion.main>
      </Suspense>
      <PublicFooter />
      <MobileConversionBar />
      <ContactLauncher />
    </div>
  );
}

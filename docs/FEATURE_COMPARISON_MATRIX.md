# Matrice de comparaison V3 / V4

Légende : **V3** = original plus fort ; **V4** = référence plus forte ; **Fusion** =
complément retenu ; **Prudence** = non modifié sans besoin métier confirmé.

| Domaine | Décision | Fichiers principaux | Impact / vérification |
| --- | --- | --- | --- |
| Architecture | V3 | `app/`, `supabase/`, Vite | Aucun backend modifié ; build. |
| Dépendances | V3 | `package.json` | Aucun ajout ; lockfile inchangé. |
| Routage | Fusion | `app/App.tsx`, sitemap | Ajout routes SEO ; tests routes. |
| Homepage | V3 | `HomePage`, carousel, médias | V3 plus riche ; régression build. |
| Navbar / footer | V3 | layouts publics | V3 conserve navigation et a11y. |
| Design, typo, boutons, cartes | V3 | `styles.css`, UI | Déjà palette/tokens cibles. |
| Formulaires | Fusion | diagnostic, rendez-vous | V3 data flow, V4 ordre diagnostic. |
| Animations / responsive | V3 | Motion, médias | V3 garde reduced motion/mobile variants. |
| SASU / EURL / SAS / SARL | V3 | landing content | Contenu et héros V3 ; tests route. |
| Pages de situation | Fusion | `landingPages.ts` | Landing demandeur d’emploi ajoutée. |
| Diagnostic / résultat | Fusion | `features/diagnostic/*` | V4 situation-first, V3 persistance ; tests unitaires. |
| Lead / rendez-vous | V3 | repositories, pages | Aucun changement Supabase. |
| Authentification | V3 | Auth pages/provider | V3 garde reset de mot de passe. |
| Dashboard / gestion projet | V3 | pages app | Hiérarchie V3 déjà renforcée. |
| Orientation / associés | V3 | pages app | Pas de régression fonctionnelle. |
| Documents / formalités / suivi | V3 | pages app, repositories | Contrats backend conservés. |
| Messages / notifications | V3 | pages app | V3 conserve Notifications dédiée. |
| Guide Orée | Fusion | knowledge/index | Nouvelles routes indexées ; génération. |
| Opérations | V3 | `pages/ops` | V3 garde Aide et Profil. |
| Supabase / RLS / Storage | Prudence | `supabase/` | Aucun changement ni migration. |
| Analytics / consentement | Fusion | `services/analytics.ts` | Événements V4 ajoutés sans PII. |
| SEO / sitemap | Fusion | metadata, sitemap | Canonical/métadonnées par landing. |
| Performance | V3 | imagerie/asset pipeline | AVIF/WebP et code splitting conservés. |
| Accessibilité | Fusion | diagnostic/CTA | Focus, labels, reduced motion ; E2E. |
| Images | V3 | `content/imagery.ts` | V4 doublons rejetés ; manifest V3. |
| Documentation | Fusion | `docs/` | Audit, plan, matrice et rapport final. |

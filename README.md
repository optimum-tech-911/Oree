# Orée — plateforme de création d'entreprise

Frontend complet de démonstration et socle d'intégration pour une plateforme française de création de société. Le projet réunit :

- des pages d'acquisition dédiées à Google Search ;
- un diagnostic adaptatif sans compte obligatoire ;
- un espace client réaliste ;
- un espace opérations pour les conseillers ;
- un Guide Orée local qui indexe les pages, actions et contenus du dépôt ;
- une architecture prête pour Supabase Auth, PostgreSQL, Storage et Edge Functions ;
- une configuration prête pour GitHub et Cloudflare Pages ;
- une reconstruction V3 mobile, tablette et desktop fondée sur quatre couleurs, deux polices et un assistant global, documentée dans `docs/V3_REBUILD.md`.

> **Important :** « Orée », les coordonnées, les prix, les témoignages et certaines données sont des éléments de démonstration. Ils doivent être validés ou remplacés avant toute mise en production commerciale.

## Démarrage rapide

Prérequis : Node.js 22.12 ou supérieur.

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:5173`.

Le projet fonctionne immédiatement en **mode démonstration**, sans Supabase. Les connexions, projets, documents, messages et opérations utilisent alors des données locales réalistes.

## Commandes

```bash
npm run dev          # développement
npm run build        # index du Guide + TypeScript + build Vite
npm run preview      # aperçu du build
npm run lint         # ESLint
npm run typecheck    # TypeScript strict
npm run test         # tests unitaires
npm run test:e2e     # parcours Playwright (après installation des navigateurs)
npm run check        # lint + types + tests + build
```

## Brancher Supabase

1. Copier `.env.example` vers `.env.local`.
2. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` (ou l’ancienne `VITE_SUPABASE_ANON_KEY`).
3. Appliquer les migrations dans `supabase/migrations/`.
4. Déployer les Edge Functions dans `supabase/functions/`.
5. Configurer les URLs de redirection Auth.
6. Remplacer les données de démonstration par les repositories Supabase.

Voir [docs/SUPABASE_BACKEND.md](docs/SUPABASE_BACKEND.md).


## Sécurité et modes d’accès

- Sans clés Supabase, `/app` et `/ops` restent ouverts avec des données de démonstration pour l’inspection locale.
- Dès que Supabase est configuré, `/app` exige une session réelle et `/ops` exige un rôle `advisor` ou `admin` actif dans `staff_roles`.
- Le bandeau de consentement bloque la mesure d’audience et publicitaire tant que l’utilisateur ne l’a pas autorisée.
- Aucun rôle interne n’est déduit d’un champ de profil modifiable par le client.

## Déploiement Cloudflare Pages

- Framework preset : `Vite`
- Build command : `npm run build`
- Output directory : `dist`
- Production branch : `main`
- Node version : `22`

Les fichiers `public/_redirects` et `public/_headers` sont copiés dans le build.

Voir [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Documentation de référence

- [AGENTS.md](AGENTS.md) — contexte complet pour un agent de code
- [docs/MASTER_ARCHITECTURE.md](docs/MASTER_ARCHITECTURE.md)
- [docs/PRODUCT_BLUEPRINT.md](docs/PRODUCT_BLUEPRINT.md)
- [docs/UI_UX_SYSTEM.md](docs/UI_UX_SYSTEM.md)
- [docs/V3_REBUILD.md](docs/V3_REBUILD.md)
- [docs/IMAGE_DIRECTION.md](docs/IMAGE_DIRECTION.md)
- [docs/ENHANCEMENT_REPORT.md](docs/ENHANCEMENT_REPORT.md)
- [docs/SUPABASE_BACKEND.md](docs/SUPABASE_BACKEND.md)
- [docs/SMART_ASSISTANT.md](docs/SMART_ASSISTANT.md)
- [docs/ANALYTICS_AND_ADS.md](docs/ANALYTICS_AND_ADS.md)
- [docs/SECURITY_AND_RGPD.md](docs/SECURITY_AND_RGPD.md)
- [docs/CONTENT_EDITING.md](docs/CONTENT_EDITING.md)
- [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md)
- [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)

## Propriété et transfert

Le dépôt GitHub, les projets Cloudflare et Supabase, le domaine et les comptes publicitaires doivent appartenir au client ou à une organisation contrôlée par le client et l'équipe projet. Aucun secret ne doit être commité.

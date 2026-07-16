# Architecture technique maître

## Vue globale

```text
GitHub privé
  ├─ main ─────────────── Cloudflare Pages production
  ├─ develop ──────────── Cloudflare Pages staging
  └─ feature/* ────────── preview deployments

Navigateur
  ├─ pages publiques / diagnostic ── Cloudflare Pages
  ├─ authentification ────────────── Supabase Auth
  ├─ données autorisées ──────────── Supabase Data API + RLS
  ├─ documents ───────────────────── Supabase Storage privé
  └─ opérations sensibles ────────── Supabase Edge Functions
                                         ├─ PostgreSQL
                                         ├─ notifications
                                         ├─ CRM / Google Sheets
                                         └─ conversions Google Ads
```

## Pourquoi cette séparation

Cloudflare sert vite un frontend statique mondial. Supabase reste l'unique autorité backend, ce qui évite de disperser secrets, validations et règles métier entre plusieurs runtimes.

## Frontend

- React et TypeScript strict ;
- Vite ;
- React Router ;
- Tailwind CSS v4 ;
- Radix/shadcn à ajouter sélectivement si un composant complexe le justifie ;
- Motion ;
- React Hook Form + Zod ;
- TanStack Query ;
- repositories pour isoler les appels backend ;
- code splitting par route à renforcer lors de l'intégration finale ;
- pas de dépendance à un CMS pour la première version.

## Backend Supabase

- PostgreSQL comme source de vérité ;
- Auth avec magic link/OTP, Google et mot de passe en secours ;
- RLS pour chaque table exposée ;
- bucket `project-documents` privé ;
- Edge Functions pour lead public, création transactionnelle, liaison de lead, notifications, CRM et conversions ;
- migrations SQL dans Git ;
- staging et production séparés.

## Environnements

### Local/démo

Aucune variable Supabase : l'interface utilise les mocks et localStorage.

### Staging

Projet Supabase distinct, fausses données, Cloudflare branch `develop`.

### Production

Projet Supabase européen, données réelles, branche `main`, secrets dédiés, sauvegardes et monitoring.

## Frontière de confiance

Le navigateur est non fiable. Il peut posséder la clé publishable mais aucune clé privilégiée. Toute autorisation vient du JWT et des policies. Les Edge Functions revérifient les entrées et n'accordent jamais un droit sur la seule base d'un paramètre fourni par le client.

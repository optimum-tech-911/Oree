# Intégration Supabase

## Variables frontend

```env
VITE_SUPABASE_URL=https://PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Ces valeurs sont publiques. La sécurité repose sur RLS.

## Secrets Edge Functions

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TURNSTILE_SECRET_KEY=
ALLOWED_ORIGINS=https://domaine.fr,https://staging.domaine.fr
RESEND_API_KEY=
CRM_WEBHOOK_URL=
CRM_WEBHOOK_SECRET=
```

## Migrations

Appliquer dans l'ordre :

1. `0001_initial_schema.sql`
2. `0002_rls_policies.sql`
3. `0003_storage_and_seed.sql`

Avec le CLI :

```bash
supabase link --project-ref PROJECT_REF
supabase db push
supabase functions deploy submit-lead
supabase functions deploy create-project
supabase functions deploy claim-lead
```

## Auth

Activer au minimum :

- email OTP/magic link ;
- Google OAuth ;
- mot de passe en secours.

Configurer les redirect URLs locales, staging, previews nécessaires et production. Pour les previews, préférer une stratégie contrôlée afin de ne pas autoriser des domaines arbitraires.

## Rôles

Les rôles internes sont dans `staff_roles`. L'utilisateur ne peut pas écrire cette table. Un profil public ne contient pas de rôle administrateur éditable.

## Documents

Le bucket `project-documents` est privé. Les chemins sont :

```text
{project_id}/{document_id}/{version_id}.{ext}
```

Les policies vérifient l'appartenance au projet. Les validations de document restent réservées au staff.

## Repositories frontend

Les composants appellent les repositories de `app/services/supabase/repositories.ts`. Conserver cette couche même après branchement complet afin de centraliser mapping, erreurs, cache et mocks.

## Transactions

Les opérations créant plusieurs objets doivent finir dans une fonction SQL transactionnelle ou une Edge Function : création de projet, création des tâches initiales, conversation, checklist et événement d'ouverture.

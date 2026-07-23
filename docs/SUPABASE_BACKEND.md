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
LEAD_CLAIM_SECRET=at-least-32-random-characters
PRIVACY_POLICY_VERSION=version-publiee
ALLOWED_ORIGINS=https://domaine.fr,https://staging.domaine.fr
RESEND_API_KEY=
CRM_WEBHOOK_URL=
CRM_WEBHOOK_SECRET=
```

Le formulaire de diagnostic ne dépend d'aucune configuration captcha externe. La
fonction `submit-lead` conserve la validation Zod, le consentement, l'idempotence,
le honeypot invisible et un rate limiting serveur fondé sur des empreintes hachées
dans `lead_intake_attempts`.

## Migrations

Appliquer dans l'ordre :

1. `0001_initial_schema.sql`
2. `0002_rls_policies.sql`
3. `0003_storage_and_seed.sql`
4. `0004_security_hardening.sql`
5. `0005_optional_lead_phone.sql`
6. `0006_appointment_permission_hardening.sql`
7. `0007_portal_operations_and_intake.sql`
8. `0008_portal_documents_and_read_state.sql`
9. `0009_rls_advisor_cleanup.sql`
10. `0010_permission_hardening_repair.sql`
11. `0011_operations_workflow_repair.sql`
12. `0012_lead_intake_attempts.sql`

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

Les composants appellent `app/services/supabase/portal.ts` pour l’espace client,
`app/services/supabase/operations.ts` pour l’espace équipe, et les repositories
génériques de `app/services/supabase/repositories.ts`. Conserver cette couche afin de
centraliser mapping, erreurs, cache, contrôle du mode démonstration et mutations.

## Transactions

Les opérations créant plusieurs objets doivent finir dans une fonction SQL transactionnelle ou une Edge Function : création de projet, création des tâches initiales, conversation, checklist et événement d'ouverture.

## État distant au 22 juillet 2026

- projet lié : `sksydcdkliuisaahysya` (`oree`) ;
- migrations `0001` à `0012` appliquées ;
- `submit-lead`, `claim-lead` et `create-project` actives ;
- la procédure transactionnelle `submit_lead_bundle` a été vérifiée sur le projet
  distant dans une transaction annulée, sans conserver de lead de test ;
- `db lint --linked --level warning` : aucune erreur de schéma ;
- secret de revendication de lead généré et configuré côté Edge ;
- origine locale autorisée pour le développement.

Le jeton de gestion Supabase ne doit jamais être placé dans un fichier `.env`, dans le
frontend ou dans Git. Il sert uniquement aux opérations CLI ponctuelles. L’origine de
production et les URLs Auth doivent encore être configurées avec le domaine définitif.

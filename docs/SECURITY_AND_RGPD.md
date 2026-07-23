# Sécurité et RGPD

## Mesures fondamentales

- RLS partout ;
- clé service role uniquement côté serveur ;
- honeypot invisible sur les entrées publiques ;
- rate limiting serveur ;
- validation Zod serveur ;
- bucket privé ;
- URLs signées courtes ;
- historique des versions de documents ;
- audit des actions staff ;
- CSP à déployer d'abord en Report-Only ;
- séparation staging/production ;
- sauvegardes et procédure de restauration.

## Formulaire

La demande de service et le marketing sont séparés. La case marketing est facultative et décochée par défaut. Le formulaire affiche l'identité du responsable, la finalité, les destinataires, la durée, les droits et le contact.

## Cookies

Avant choix : analytics et publicité refusées par défaut. Après choix : mise à jour Consent Mode selon la décision. Le refus doit être aussi simple que l'acceptation.

## Conservation

Créer des durées par finalité : diagnostic abandonné, prospect non qualifié, prospect actif, client, obligations légales, compte supprimé. Ne pas conserver « pour toujours ».

## Droits

Prévoir : accès, export, rectification, suppression, limitation, opposition et retrait du consentement marketing.

## Audit avant production

Faire valider les textes juridiques, la base légale, les sous-traitants, les durées, les transferts éventuels, les mesures de sécurité et le cadre professionnel de l'accompagnement.

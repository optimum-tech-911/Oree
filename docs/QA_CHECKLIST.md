# Checklist QA

## Automatique

```bash
npm run check
```

## Parcours public

- toutes les routes ouvrent sans erreur ;
- page Google cohérente avec son intention ;
- diagnostic complet sur mobile ;
- retour navigateur conservé ;
- rechargement conserve la progression non sensible ;
- coordonnées validées ;
- confirmation claire ;
- Guide Orée retrouve pages et actions.

## Auth et permissions

- mode démo client ;
- mode démo ops avec email contenant `ops` ;
- utilisateur réel limité à ses projets ;
- client incapable de valider un document ;
- conseiller incapable d'accéder à un projet non attribué ;
- aucun rôle admin auto-attribué.

## Documents

- types et tailles limités ;
- URL privée ;
- nouvelle version sans écraser l'ancienne ;
- commentaire de correction visible ;
- état synchronisé dans la timeline.

## Responsive

- iPhone 320–430 px ;
- tablette ;
- laptop ;
- écran large ;
- menu, assistant, tableaux et formulaires utilisables.

## Navigateurs

- Safari iOS ;
- Chrome ;
- Firefox ;
- Edge.

## Performance

- images AVIF/WebP ;
- pas de vidéo lourde obligatoire ;
- bundles app/ops séparés à optimiser ;
- pas de layout shift ;
- reduced motion ;
- audit Lighthouse avant ads.

## RGPD et tracking

- refus avant tags publicitaires ;
- aucune PII dans GA4 ;
- attribution stockée ;
- `lead_qualified` enregistrable ;
- politique de confidentialité finale ;
- durées de conservation configurées.

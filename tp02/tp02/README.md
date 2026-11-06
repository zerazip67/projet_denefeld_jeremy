# TP02 — Application Pollution

Ce projet contient l’application Angular du TP et l’API pédagogique CNAM
(Node.js, Express, TypeScript, Sequelize et PostgreSQL) dans `api/`.

## Structure

```text
├── api/                 # API Node.js / TypeScript / Express / Sequelize
│   └── src/
│       ├── config.ts
│       ├── controllers/
│       ├── models/
│       └── routes/
├── public/              # Ressources statiques Angular
└── src/                 # Application Angular
```

## Démarrage local

Prérequis : Node.js 22.22.3 et npm (version également configurée pour Render).

1. Démarrez PostgreSQL et configurez l’API. Depuis le dossier `api` :

```powershell
npm ci
Copy-Item .env.example .env
```

Renseignez `DATABASE_URL` dans `api/.env`, ou définissez `DB_HOST`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD` et `DB_NAME`. Le fichier `.env` est ignoré par Git.
Puis démarrez le backend :

```powershell
npm run dev
```

L’API écoute sur `http://localhost:3000` :

- `GET /health` vérifie que le serveur fonctionne.
- `GET /api/pollutions` renvoie les mesures.
- `GET /api/pollutions/:id` renvoie une mesure par identifiant.
- `GET /api/signalements` renvoie les déclarations enregistrées.
- `GET /api/signalements/:id` renvoie une déclaration.
- `POST /api/signalements` crée une déclaration.
- `PUT /api/signalements/:id` modifie une déclaration.
- `DELETE /api/signalements/:id` supprime une déclaration.
- `POST /api/pollutions` crée une mesure (`ville`, `valeur`, `polluant`,
  `date` et `description` facultative).
- `PUT /api/pollutions/:id` remplace une mesure. Les quatre champs principaux
  sont obligatoires; `description` est facultative.
- `PATCH /api/pollutions/:id` modifie un ou plusieurs champs.
- `DELETE /api/pollutions/:id` supprime une mesure.

Les routes acceptent aussi le préfixe singulier `/api/pollution`. Les
identifiants invalides renvoient `400`, les mesures absentes `404` et les
données invalides `400`.

À son premier démarrage, l’API synchronise le modèle Sequelize et insère des
mesures de démonstration si la table est vide.

Pour tester la route depuis PowerShell :

```powershell
Invoke-RestMethod http://localhost:3000/api/pollutions
```

La réponse attendue est une liste JSON de mesures avec les champs `id`,
`ville`, `polluant`, `valeur`, `date` et `description`.
Le formulaire Angular utilise `/api/signalements`; chaque déclaration
(`titre`, `type`, `description`, `date`, `lieu`, `latitude`, `longitude`,
`photo`) est stockée dans la table PostgreSQL `signalement`. Cette table est
créée au démarrage sans modifier ni supprimer la table existante `pollution`.

2. Dans un autre terminal, depuis la racine du projet Angular :

```powershell
npm ci
npm start
```

L’application s’ouvre sur `http://localhost:4200`.

## Tests et compilation

Depuis la racine Angular :

```powershell
npm test -- --watch=false
npm run build
```

Pour compiler le backend :

```powershell
Set-Location api
npm run build
```

## Déploiement sur Render

Le `render.yaml` de ce dossier déclare trois ressources : PostgreSQL, l’API
Node.js et le site Angular statique. Les `rootDir` du Blueprint sont définis
depuis la racine du dépôt : `tp02/tp02/api` pour l’API et `tp02/tp02` pour le
site, publié depuis `dist/tp02/browser`. Créez un Blueprint Render à partir du
dépôt et appliquez la configuration.

## Compatibilité du frontend

En production, le frontend utilise l’API Render définie dans
`src/environments/environment.production.ts`. Les opérations sur les
déclarations passent par l’API et PostgreSQL; seule l’inscription reste
simulée localement, car cette API ne fournit pas de service de comptes.

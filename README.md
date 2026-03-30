# CarExpress

Une application React/Vite pour la gestion/location/vente de véhicules (UI prototype).

Ce dépôt contient une version front-end prête à être buildée et servie statiquement.

Principales infos
- Framework : React 18 + Vite
- Styling : Tailwind CSS (configurée)
- Build : Vite `npm run build`

Ressources détaillées et la conception se trouvent dans `README_DESIGN.md`.

Quickstart (local)
```bash
cd carexpress-react
npm install
npm run dev
```

Build production
```bash
npm run build
```

Docker

Le projet contient un `Dockerfile` multi-stage et des fichiers docker-compose pour faciliter le déploiement.

Build image (local) :
```bash
docker build -t carexpress-react:latest .
```

Run production container :
```bash
docker run --rm -p 8080:80 carexpress-react:latest
```

Run with Docker Compose (production) :
```bash
docker-compose up --build -d
```

Run in development (hot-reload) :
```bash
docker-compose -f docker-compose.dev.yml up
```

Conseils
- Le `Dockerfile` construit l'application avec Node puis sert les fichiers statiques via `nginx`.
- `nginx.conf` contient une règle `try_files` pour supporter les routes SPA.
- Si vous avez un backend, ajoutez un service `backend` dans `docker-compose.yml` et configurez le proxy dans `nginx.conf`.

Contribuer
- Faire une branche feature et ouvrir une pull request. Respecter la structure `src/components`, `src/pages`, `src/services`.

Licence
- Ajoutez un fichier `LICENSE` si vous souhaitez préciser la licence du projet.

---

Version: 1.0.0 — Dernière mise à jour: Mars 2026

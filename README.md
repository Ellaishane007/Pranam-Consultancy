# PRANAM Consultancy website

Corporate website for **PRANAM Consultancy**, a Mumbai-based HR and manpower consulting firm founded around 2026 by Prashant Chavan.

Stack: Node.js, Express, EJS, Tailwind CSS. Forms can persist to MongoDB or to local JSON files.

## Requirements

- Node.js 20 or later
- Optional: MongoDB

## Setup

```bash
cp .env.example .env
npm install
npm run build:css
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `SESSION_SECRET` to a long random value before production. Leave `MONGODB_URI` empty to store contact, candidate, and employer submissions in `data/local/` (gitignored).

Resumes are saved under `uploads/resumes/` (not publicly served).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Watch CSS + restart the server |
| `npm run build:css` | Minify Tailwind output |
| `npm start` | Production server (`NODE_ENV=production`) |

## Production notes

- Serve behind HTTPS.
- Set `SITE_URL`, `SESSION_SECRET`, and `MONGODB_URI`.
- Add verified `CONTACT_*` and `GOOGLE_MAPS_EMBED_URL` values when available.
- Do not expose `/uploads` as static files.
- Job cards on `/careers` are demo listings until real vacancies are published.

## Architecture for later

Models and `src/services/storage.js` are ready for an admin dashboard (applications, enquiries, messages). Do not add public download routes for resumes.

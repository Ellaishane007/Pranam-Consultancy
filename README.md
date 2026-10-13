# PRANAM Consultancy

Corporate website for PRANAM Consultancy, an HR and manpower consulting firm based in Goregaon West, Mumbai.

**Stack:** Node.js 20+, Express, EJS, Tailwind CSS, MongoDB.

## Local development

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env` and keep `NODE_ENV=development`.
3. Install dependencies with `npm ci`.
4. Start the development server and CSS watcher with `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000).

MongoDB is optional for local development. Without `MONGODB_URI`, form submissions are written to `data/local/`; resume files are saved under `uploads/resumes/`. Both directories are excluded from Git. Local JSON persistence is single-instance development storage, not a production database.

## Checks and production build

```bash
npm test
npm run build
```

Run the production server with `npm start`.

## Production configuration

Production startup requires:

- `NODE_ENV=production`
- `SITE_URL` set to the public HTTPS origin, without a path
- `SESSION_SECRET` set to a unique random value of at least 32 characters
- `MONGODB_URI` set to a reachable MongoDB deployment
- `TRUST_PROXY` set to the number of trusted reverse-proxy hops (for example, `1` behind one proxy)

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Set verified `CONTACT_*` values as needed. Resume uploads are private files and are never served as static assets. Mount persistent, access-controlled storage at `/app/uploads` when running the container. Back up the MongoDB data and uploaded resumes according to your retention policy.

The `/health` endpoint reports process liveness. `/ready` reports readiness and returns HTTP 503 if MongoDB is unavailable.

## Docker deployment

Build the production image:

```bash
docker build -t pranam-consultancy .
```

Run behind an HTTPS-terminating reverse proxy, supplying secrets through your deployment platform (not in the image or source tree). Example:

```bash
docker run --name pranam-consultancy \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e SITE_URL=https://www.example.com \
  -e SESSION_SECRET="<generated-random-secret>" \
  -e MONGODB_URI="<mongodb-connection-string>" \
  -e TRUST_PROXY=1 \
  -v pranam-uploads:/app/uploads \
  pranam-consultancy
```

Replace the example hostname and values. Configure the proxy to forward HTTPS and client IP information correctly. Do not publish the MongoDB connection string in logs or documentation.

## Content and launch checks

- Career listings are explicitly marked as demo content until replaced with current vacancies.
- Review the Privacy Policy and Terms with qualified counsel and confirm retention, contact, and data-subject request procedures before accepting real candidate information.
- Confirm company naming, founding date, leadership details, client references, and all public contact details before launch.

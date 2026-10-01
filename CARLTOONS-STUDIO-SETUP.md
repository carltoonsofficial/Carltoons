
# Carltoons Studio — setup

This version adds a public website and a private owner-only Studio at `/admin`.

## Required Vercel environment variables

Create these in Vercel:

- `BLOB_READ_WRITE_TOKEN` — create a Vercel Blob store and copy its read/write token.
- `CARLTOONS_ADMIN_PASSWORD` — your private Studio password.
- `CARLTOONS_SESSION_SECRET` — a long random secret (32+ characters).

Set them for Production and Preview as appropriate.

## Local development

Copy `.env.example` to `.env.local` and fill in the values.

Then:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public website and `http://localhost:3000/admin` for Carltoons Studio.

## Studio features

- Owner password login
- Upload images, videos and selected files to Vercel Blob
- Create, edit, publish and unpublish content
- Feature content on the homepage
- Delete content records
- Drag and drop ordering
- Mobile and desktop responsive UI

Normal content changes do not require editing `page.tsx`; the public site reads published content from the content API.

# RAYQ Lead Intelligence

Internal lead generation and lead intelligence dashboard for RAYQ Marketing Agency.

## What it does

- Stores production leads in Supabase.
- Scores leads from 0-100 and classifies priority.
- Runs approved Google Places discovery and clearly labeled demo discovery.
- Analyzes website/business notes with transparent heuristics.
- Generates review-ready LinkedIn, Instagram, email, WhatsApp, follow-up, and audit invitation drafts.
- Imports and exports CSV files.
- Deletes single leads, bulk selected leads, and demo/sample leads.

## Compliance

This tool is designed for public business information, manual imports, CSV uploads, and approved APIs only. It does not include illegal scraping, platform-term violations, or automated spam sending. Outreach messages are drafts for human review.

## Supabase setup

1. Create a new project at Supabase.
2. Open the Supabase SQL Editor.
3. Paste and run `database/schema.sql`.
4. Open Project Settings -> API.
5. Copy the project URL, anon key, and service role key.
6. Add the same values locally in `.env.local` and in Vercel project environment variables.

Required database tables from `database/schema.sql`:

- `leads`
- `follow_ups`
- `outreach_notes`
- `discovered_leads`

## Environment variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GOOGLE_PLACES_API_KEY="your-google-places-key"
```

Add the same Supabase variables in Vercel. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only and never use it in frontend code.

If Supabase variables are missing in production, the app shows a setup error instead of trying to write to the local filesystem. Local JSON storage is only a development fallback.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test add and delete after deployment

1. Deploy to Vercel with the Supabase environment variables set.
2. Open `/add-lead` and add a test lead.
3. Open `/leads` and confirm the lead appears.
4. Click the lead's Delete action, confirm the modal, and confirm the row disappears.
5. Add two test leads, select both on `/leads`, click Delete selected, and confirm both disappear.
6. Add or import a lead with source `Demo`, `Mock Data`, or `sample`, then open `/settings` and use Remove Demo Leads.

## Development data

`data/leads.json` remains only as a local development fallback when Supabase is not configured. It is not used for production writes on Vercel.

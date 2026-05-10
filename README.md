# RAYQ Lead Intelligence

Internal lead generation and lead intelligence dashboard for RAYQ Marketing Agency.

## What it does

- Stores leads in a local JSON database for immediate use.
- Scores leads from 0-100 and classifies priority.
- Analyzes website/business notes with transparent heuristics.
- Generates review-ready LinkedIn, Instagram, email, WhatsApp, follow-up, and audit invitation drafts.
- Imports CSV files and pasted website/business-name lists.
- Exports all leads to CSV.
- Includes a Supabase-ready SQL schema and API-key placeholders for approved enrichment APIs.

## Compliance

This tool is designed for public business information, manual imports, CSV uploads, and approved APIs only. It does not include illegal scraping, platform-term violations, or automated spam sending. Outreach messages are drafts for human review.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` when you are ready to add approved API integrations. Do not expose private keys in frontend code.

## Data

Sample leads live in `data/leads.json`. The Supabase upgrade schema is in `database/schema.sql`.

## Future upgrades

- Supabase authentication for the 3 founders.
- Supabase database persistence.
- Approved Google Places, Hunter, Apollo, or OpenAI API enrichment through server routes.
- Real calendar integration for reminders.

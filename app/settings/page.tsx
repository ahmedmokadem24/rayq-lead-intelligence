import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/ui";

const fields = [
  "OpenAI API integration point for future AI-assisted audits",
  "Google Places approved API integration point",
  "Search API / SerpAPI approved web search placeholder",
  "Hunter.io enrichment API placeholder",
  "Apollo enrichment API placeholder",
  "Snov.io enrichment API placeholder",
  "BuiltWith technology and tracking detection placeholder",
  "Clearbit or similar enrichment placeholder",
  "Supabase auth and database upgrade path",
  "Founder assignment: Omar, Youssef, Ahmed",
  "Compliance: no illegal scraping, no automated spam sending"
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="Settings" title="System settings" description="Current build runs locally with JSON storage and is structured for a future Supabase and approved API upgrade." />
      <Card className="p-5 lg:p-6">
        <CardHeader title="Ready extension points" description="Server-side integrations can be added later without exposing private keys." />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {fields.map((field) => <div key={field} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-linen/72">{field}</div>)}
        </div>
        <div className="mt-6 rounded-2xl border border-champagne/20 bg-champagne/12 p-4 text-sm leading-6 text-linen/78">
          API keys belong in environment variables only: GOOGLE_PLACES_API_KEY, SEARCH_API_KEY or SERPAPI_API_KEY, HUNTER_API_KEY, APOLLO_API_KEY, SNOV_API_KEY, BUILTWITH_API_KEY, CLEARBIT_API_KEY, and OPENAI_API_KEY. Private keys should be used from server routes, never frontend components.
        </div>
      </Card>
    </>
  );
}

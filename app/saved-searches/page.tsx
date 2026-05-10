import { PageHeader } from "@/components/PageHeader";
import { SavedSearchesClient } from "@/components/SavedSearchesClient";
import { demoSavedSearches } from "@/lib/discovery/mockData";

export default function SavedSearchesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saved Searches"
        title="Repeatable discovery presets"
        description="Create and manage discovery presets for markets like UAE furniture brands, Egypt clinics, Saudi fashion brands, Kuwait restaurants, Germany Shopify stores, and more."
      />
      <SavedSearchesClient initialSearches={demoSavedSearches} />
    </>
  );
}

import { PageHeader } from "@/components/PageHeader";
import { ImportClient } from "@/components/ImportClient";

export default function ImportPage() {
  return (
    <>
      <PageHeader eyebrow="Import" title="CSV and list import" description="Bring in approved lead lists, public business info, or manually researched URLs. Export is available from the All Leads page." />
      <ImportClient />
    </>
  );
}

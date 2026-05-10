import { PageHeader } from "@/components/PageHeader";
import { LeadForm } from "@/components/LeadForm";

export default function AddLeadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Input"
        title="Add lead"
        description="Create a lead manually from public business information, a website, Instagram, LinkedIn, or notes from approved research."
      />
      <LeadForm />
    </>
  );
}

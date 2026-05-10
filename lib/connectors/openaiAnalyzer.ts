import type { AnalyzerInput } from "@/types/lead";
import { analyzeLead } from "@/lib/analyzer";

export async function analyzeWithOpenAI(input: AnalyzerInput) {
  // Future: call OpenAI server-side using OPENAI_API_KEY. Current behavior uses local heuristics.
  return analyzeLead(input);
}

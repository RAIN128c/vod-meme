import type { CuratedSearchResult } from "@/lib/search-dataset";

export type AiInterpretation = {
  source: "AI";
  detectedPhrase: string;
  meaningTH: string;
  meaningEN: string;
  tone: string[];
  context: string;
  relatedUnitId: string | null;
  relatedExpressions: string[];
  confidence: number;
  detectedText?: string;
  visualContext?: string;
};

export type InterpretationResult = CuratedSearchResult | AiInterpretation;

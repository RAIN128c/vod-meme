import { learningUnits, type LearningUnit } from "@/data/learning-units";

export type CuratedSearchResult = {
  source: "CURATED";
  detectedPhrase: string;
  meaningTH: string;
  meaningEN: string;
  tone: string[];
  context: string;
  relatedUnitId: string;
  relatedExpressions: string[];
};

export function normalizeSearchQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreUnit(query: string, unit: LearningUnit) {
  const terms = [unit.title, ...unit.aliases, ...(unit.variants ?? [])].map(normalizeSearchQuery);
  if (terms.includes(query)) return 100;
  if (terms.some((term) => term.includes(query))) return 80;
  if (terms.some((term) => query.includes(term))) return 75;

  const queryTokens = new Set(query.split(" "));
  const bestOverlap = terms.reduce((best, term) => {
    const tokens = term.split(" ");
    const overlap = tokens.filter((token) => queryTokens.has(token)).length;
    return Math.max(best, overlap / tokens.length);
  }, 0);
  return bestOverlap >= 0.5 ? Math.round(40 + bestOverlap * 20) : 0;
}

export function searchCuratedDataset(query: string): CuratedSearchResult | null {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return null;

  const match = learningUnits
    .map((unit) => ({ unit, score: scoreUnit(normalized, unit) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!match || match.score < 75) return null;

  const relatedExpressions = learningUnits
    .filter((unit) => unit.id !== match.unit.id)
    .slice(0, 3)
    .map((unit) => unit.title);

  return {
    source: "CURATED",
    detectedPhrase: match.unit.title,
    meaningTH: match.unit.meaningTH ?? "ความหมายขึ้นกับ reference และ timing มากกว่าคำแปลตรงตัว",
    meaningEN: match.unit.meaningEN ?? "Meaning depends on a shared reference and the moment it appears.",
    tone: match.unit.tone,
    context: match.unit.examples[0]?.en ?? match.unit.subtitle,
    relatedUnitId: match.unit.id,
    relatedExpressions,
  };
}

export const INITIAL_BRAINCELLS = 86_000_000_000;

const ranks = [
  { name: "NORMIE", minimumAura: 0 },
  { name: "REPLY GUY", minimumAura: 25 },
  { name: "TERMINALLY ONLINE", minimumAura: 60 },
  { name: "CONTEXT SEER", minimumAura: 110 },
];

export function getMemeRank(aura: number) {
  return [...ranks].reverse().find((rank) => aura >= rank.minimumAura) ?? ranks[0];
}

export function getNextRank(aura: number) {
  return ranks.find((rank) => rank.minimumAura > aura) ?? null;
}

export function formatBraincells(braincells: number, compact = true) {
  if (!compact) return braincells.toLocaleString("en-US");
  return `${(braincells / 1_000_000_000).toFixed(1)}B`;
}

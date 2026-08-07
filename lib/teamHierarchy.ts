// Fixed hierarchy for standard Executive Board positions. Anything not in
// this list (other committees, custom titles) falls back to the
// manually-set `order` field, then alphabetical by name.
export const EXECUTIVE_BOARD_POSITIONS = [
  'President',
  'VP Internal',
  'VP External',
  'Secretary',
  'Treasurer',
  'Auditor',
  'P.R.O',
  'Event Director',
  'Team Manager',
  'Promotion Head',
  'Technical Head',
];

export function sortTeamMembers<T extends { position: string; order: number; name: string }>(
  members: T[]
): T[] {
  return [...members].sort((a, b) => {
    const rankA = EXECUTIVE_BOARD_POSITIONS.indexOf(a.position);
    const rankB = EXECUTIVE_BOARD_POSITIONS.indexOf(b.position);
    const effectiveRankA = rankA === -1 ? Infinity : rankA;
    const effectiveRankB = rankB === -1 ? Infinity : rankB;

    if (effectiveRankA !== effectiveRankB) {
      return effectiveRankA - effectiveRankB;
    }
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.name.localeCompare(b.name);
  });
}
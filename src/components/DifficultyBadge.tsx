export function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  if (!difficulty) return null;
  const harder = difficulty.toLowerCase().includes('harder');
  return <span className={`difficulty-badge ${harder ? 'harder' : 'equivalent'}`} title={difficulty} aria-label={difficulty}>{harder ? 'Harder' : 'Equivalent'}</span>;
}

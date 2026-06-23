export default function Badge({ level, score = 0, ratingsCount = 0 }) {
  const getBadge = () => {
    if (ratingsCount < 3) return { label: "New", color: "var(--text-muted)" };
    if (score <= 40) return { label: "Low Trust", color: "var(--red)" };
    if (score <= 65) return { label: "Building", color: "#F59E0B" };
    if (score <= 85) return { label: "Trusted", color: "var(--green)" };
    if (ratingsCount >= 10) return { label: "Top Rated", color: "#F6C000" };
    return { label: "Trusted", color: "var(--green)" };
  };

  const badge = getBadge();

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold leading-tight border"
      style={{
        color: badge.color,
        backgroundColor: `${badge.color}15`,
        borderColor: `${badge.color}25`,
      }}
    >
      {badge.label}
    </span>
  );
}

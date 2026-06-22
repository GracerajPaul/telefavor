export default function Badge({ level, score, ratingsCount }) {
  const getBadge = () => {
    if ((ratingsCount ?? 0) < 3) return { label: "New", color: "#94A3B8", bg: "rgba(148,163,184,0.15)" };
    if (score <= 40) return { label: "Low Trust", color: "#EF4444", bg: "rgba(239,68,68,0.15)" };
    if (score <= 65) return { label: "Building", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
    if (score <= 85) return { label: "Trusted", color: "#22C55E", bg: "rgba(34,197,94,0.15)" };
    if ((ratingsCount ?? 0) >= 10) return { label: "Top Rated", color: "#F6C000", bg: "rgba(246,192,0,0.15)" };
    return { label: "Trusted", color: "#22C55E", bg: "rgba(34,197,94,0.15)" };
  };

  const badge = getBadge();

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{ background: badge.bg, color: badge.color }}
    >
      {badge.label}
    </span>
  );
}

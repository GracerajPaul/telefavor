const levels = [
  { label: "New", color: "#8888A0", bg: "rgba(136,136,160,0.12)", minScore: 0, needRatings: 3 },
  { label: "Low Trust", color: "#EF4444", bg: "rgba(239,68,68,0.12)", minScore: 0 },
  { label: "Building", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", minScore: 40 },
  { label: "Trusted", color: "#22C55E", bg: "rgba(34,197,94,0.12)", minScore: 66 },
  { label: "Top Rated", color: "#F6C000", bg: "rgba(246,192,0,0.12)", minScore: 86 },
];

export default function Badge({ level, score, ratingsCount = 0 }) {
  let badge;
  if (ratingsCount < 3) {
    badge = levels[0];
  } else if (score > 85 && ratingsCount >= 10) {
    badge = levels[4];
  } else {
    badge = levels.slice(1).find((l) => score >= l.minScore) || levels[0];
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ color: badge.color, background: badge.bg }}
    >
      {badge.label}
    </span>
  );
}

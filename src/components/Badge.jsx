const BADGE_CONFIG = {
  new:       { label: "New",       color: "#A0A0A0" },
  lowTrust:  { label: "Low Trust", color: "#EF4444" },
  building:  { label: "Building",  color: "#F59E0B" },
  trusted:   { label: "Trusted",   color: "#22C55E" },
  topRated:  { label: "Top Rated", color: "#FF6B35" },
};

export default function Badge({ level, score = 0, ratingsCount = 0 }) {
  const getBadge = () => {
    if (ratingsCount < 3) return BADGE_CONFIG.new;
    if (score <= 40) return BADGE_CONFIG.lowTrust;
    if (score <= 65) return BADGE_CONFIG.building;
    if (score > 85 && ratingsCount >= 10) return BADGE_CONFIG.topRated;
    return BADGE_CONFIG.trusted;
  };

  const badge = getBadge();

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-tight border"
      style={{ color: badge.color, borderColor: `${badge.color}40`, background: `${badge.color}12` }}>
      {badge.label}
    </span>
  );
}

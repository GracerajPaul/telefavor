const BADGE_CONFIG = {
  new:       { label: \"New\",       color: \"#8b9dc0\", glow: false },
  lowTrust:  { label: \"Low Trust\", color: \"#f87171\", glow: true },
  building:  { label: \"Building\",  color: \"#fbbf24\", glow: true },
  trusted:   { label: \"Trusted\",   color: \"#34d399\", glow: true },
  topRated:  { label: \"⭐ Top Rated\", color: \"#f6c000\", glow: true },
};

export default function Badge({ level, score = 0, ratingsCount = 0 }) {
  const getBadge = () => {
    if (ratingsCount < 3) return BADGE_CONFIG.new;
    if (score <= 40) return BADGE_CONFIG.lowTrust;
    if (score <= 65) return BADGE_CONFIG.building;
    if (ratingsCount >= 10 && score > 85) return BADGE_CONFIG.topRated;
    if (score <= 85) return BADGE_CONFIG.trusted;
    return BADGE_CONFIG.trusted;
  };

  const badge = getBadge();

  return (
    <span
      className=\"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-tight\"
      style={{
        color: badge.color,
        backgroundColor: `${badge.color}14`,
        border: `1px solid ${badge.color}28`,
        boxShadow: badge.glow ? `0 0 8px ${badge.color}20` : 'none',
      }}
    >
      {badge.label}
    </span>
  );
}

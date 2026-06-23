import Badge from "./Badge";

function getBadge(score, ratingsCount) {
  if (ratingsCount < 3) return { label: "New", color: "#8888A0", bg: "rgba(136,136,160,0.12)" };
  if (score > 85 && ratingsCount >= 10) return { label: "Top Rated", color: "#F6C000", bg: "rgba(246,192,0,0.12)" };
  if (score >= 66) return { label: "Trusted", color: "#22C55E", bg: "rgba(34,197,94,0.12)" };
  if (score >= 40) return { label: "Building", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" };
  return { label: "Low Trust", color: "#EF4444", bg: "rgba(239,68,68,0.12)" };
}

export default function TrustScoreSection({ userData, size = "normal" }) {
  const total = (userData?.green_ratings || 0) + (userData?.red_ratings || 0);
  const score = userData?.trust_score || 0;
  const badge = getBadge(score, total);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge level={null} score={score} ratingsCount={total} />
        <span className="text-[12px] text-text-muted">{total} rating{total !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green" />
          <span className="text-[13px] text-text-secondary">
            <span className="text-green font-semibold">{userData?.green_ratings || 0}</span> green
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red" />
          <span className="text-[13px] text-text-secondary">
            <span className="text-red font-semibold">{userData?.red_ratings || 0}</span> red
          </span>
        </div>
      </div>

      {total >= 3 ? (
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full bg-bg-inset overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${score}%`,
                background: `linear-gradient(90deg, #06B6D4, ${score > 66 ? "#22C55E" : "#F59E0B"})`,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted">{score}% success rate</span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: badge.color }}
            >
              {badge.label}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-text-muted">
          {userData?.green_ratings || 0}/{total} successful — needs 3+ to level up
        </p>
      )}
    </div>
  );
}

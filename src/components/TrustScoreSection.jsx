import Badge from "./Badge";

const getBadge = (score, ratingsCount) => {
  if ((ratingsCount ?? 0) < 3) return { label: "New", color: "#94A3B8", bg: "rgba(148,163,184,0.15)" };
  if (score <= 40) return { label: "Low Trust", color: "#EF4444", bg: "rgba(239,68,68,0.15)" };
  if (score <= 65) return { label: "Building", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
  if (score <= 85) return { label: "Trusted", color: "#22C55E", bg: "rgba(34,197,94,0.15)" };
  if ((ratingsCount ?? 0) >= 10) return { label: "Top Rated", color: "#F6C000", bg: "rgba(246,192,0,0.15)" };
  return { label: "Trusted", color: "#22C55E", bg: "rgba(34,197,94,0.15)" };
};

export default function TrustScoreSection({ userData, size = "normal" }) {
  if (!userData) return null;

  const green = userData.green_ratings || 0;
  const red = userData.red_ratings || 0;
  const total = green + red;
  const score = userData.trust_score || 0;
  const pct = total > 0 ? (green / total) * 100 : 0;
  const isLarge = size === "large";
  const badge = getBadge(score, total);

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-2">
        <span
          className={`inline-flex items-center ${isLarge ? "px-4 py-1.5 text-[14px]" : "px-3 py-1 text-[12px]"} rounded-full font-semibold`}
          style={{ background: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>
        {total === 0 && (
          <span className="text-[13px] text-[#94A3B8]">No ratings yet</span>
        )}
        {total > 0 && total < 3 && (
          <span className="text-[13px] text-[#94A3B8]">{green}/{total} successful — needs 3+ ratings to level up</span>
        )}
      </div>

      {total > 0 && (
        <>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <span className={`${isLarge ? "text-[28px]" : "text-[22px]"} font-bold text-[#22C55E]`}>
                {green}
              </span>
              <p className={`${isLarge ? "text-[13px]" : "text-[11px]"} text-[#94A3B8]`}>
                Successful
              </p>
            </div>
            <div className="text-center">
              <span className={`${isLarge ? "text-[28px]" : "text-[22px]"} font-bold text-[#EF4444]`}>
                {red}
              </span>
              <p className={`${isLarge ? "text-[13px]" : "text-[11px]"} text-[#94A3B8]`}>
                Failed
              </p>
            </div>
          </div>

          {total >= 3 && (
            <>
              <div className="h-2 bg-[#1E1B3A] rounded-full overflow-hidden mx-4">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${badge.color}, ${badge.color})`,
                  }}
                />
              </div>

              <p className="text-center text-[13px] text-[#94A3B8]">
                {score}% trust score
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

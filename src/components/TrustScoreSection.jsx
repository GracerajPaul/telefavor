export default function TrustScoreSection({ userData, size = "small" }) {
  const total = (userData?.green_ratings || 0) + (userData?.red_ratings || 0);
  const score = total > 0 ? Math.round(((userData?.green_ratings || 0) / total) * 100) : 0;

  if (total < 3) {
    return (
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-[22px] font-light text-text">{userData?.green_ratings || 0}/{total}</span>
          <span className="text-[12px] text-text-muted">successful</span>
        </div>
        <p className="text-[11px] text-text-muted mt-1">Needs 3+ ratings to level up</p>
      </div>
    );
  }

  const barColor = score >= 80 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[28px] font-light text-text">{score}%</span>
        <span className="text-[12px] text-text-muted">Trust Score</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: barColor }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[11px] text-text-muted">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          {userData?.green_ratings || 0} green
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red" />
          {userData?.red_ratings || 0} red
        </span>
      </div>
    </div>
  );
}

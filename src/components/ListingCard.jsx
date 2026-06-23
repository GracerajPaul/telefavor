"use client";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Icon from "./Icon";

export default function ListingCard({ listing, userData, onClick }) {
  const totalRatings = (userData?.green_ratings || 0) + (userData?.red_ratings || 0);
  const trustScore = userData?.trust_score || 0;

  return (
    <button onClick={onClick} className="w-full text-left bg-bg-card border border-border rounded-xl p-4 hover:bg-bg-hover transition-colors">
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar src={userData?.photo_url} name={userData?.display_name} size={38} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-semibold text-text truncate">{userData?.display_name || "Unknown"}</p>
            <Badge level={null} score={trustScore} ratingsCount={totalRatings} />
          </div>
          <p className="text-[12px] mt-0.5 text-accent truncate">@{listing.telegram_username}</p>
        </div>
      </div>

      <div className="my-3 border-t border-border" />

      <div>
        <p className="text-[13px] font-semibold text-text">{listing.title}</p>
        {listing.message && (
          <p className="text-[12px] mt-1 line-clamp-2 text-text-secondary leading-relaxed">{listing.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <Icon name="clock" size={10} />
            {listing.posted_at
              ? new Date(listing.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Recently"}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <Icon name="users" size={10} />
            {listing.contact_taps || 0} taps
          </span>
        </div>
        {totalRatings >= 1 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: trustScore >= 85 ? "#22C55E" : trustScore >= 65 ? "#F59E0B" : trustScore >= 40 ? "#FF6B35" : "#EF4444",
                    borderColor: `${trustScore >= 85 ? "#22C55E" : trustScore >= 65 ? "#F59E0B" : trustScore >= 40 ? "#FF6B35" : "#EF4444"}40`,
                    background: `${trustScore >= 85 ? "#22C55E" : trustScore >= 65 ? "#F59E0B" : trustScore >= 40 ? "#FF6B35" : "#EF4444"}12` }}>
            {trustScore}%
          </span>
        )}
      </div>
    </button>
  );
}

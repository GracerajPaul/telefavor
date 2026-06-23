"use client";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Icon from "./Icon";

export default function ListingCard({ listing, userData, onClick }) {
  const totalRatings = (userData?.green_ratings || 0) + (userData?.red_ratings || 0);

  return (
    <button onClick={onClick} className="w-full text-left bg-bg-card border border-border rounded-xl p-4 hover:bg-bg-hover transition-colors">
      <div className="flex items-start gap-3">
        <Avatar src={userData?.photo_url} name={userData?.display_name} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-medium text-text truncate">{userData?.display_name || "Unknown"}</p>
            <Badge level={null} score={userData?.trust_score} ratingsCount={totalRatings} />
          </div>
          <p className="text-[12px] text-primary mt-0.5 truncate">@{listing.telegram_username}</p>
        </div>
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-border">
        <p className="text-[13px] font-medium text-text">{listing.title}</p>
        {listing.message && (
          <p className="text-[12px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">{listing.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-text-muted">
        <span className="flex items-center gap-1">
          <Icon name="clock" size={11} />
          {listing.posted_at ? new Date(listing.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="users" size={11} />
          {listing.contact_taps || 0}
        </span>
      </div>
    </button>
  );
}

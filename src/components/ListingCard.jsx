"use client";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import Badge from "./Badge";

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ListingCard({ listing, userData, onClick }) {
  const router = useRouter();
  const totalRatings = (userData?.green_ratings || 0) + (userData?.red_ratings || 0);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-bg-card rounded-xl border border-border p-4 card-hover active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <Avatar src={userData?.photo_url} name={userData?.display_name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-semibold text-text truncate">{userData?.display_name || "Unknown"}</p>
            <span className="text-[11px] text-text-muted flex-shrink-0">{timeAgo(listing.posted_at)}</span>
          </div>
          <p className="text-[12px] text-text-muted mt-0.5">@{listing.telegram_username}</p>
          <p className="text-[15px] font-medium text-text mt-2 leading-snug">{listing.title}</p>
          {listing.message && (
            <p className="text-[12px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">{listing.message}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <Badge level={null} score={userData?.trust_score} ratingsCount={totalRatings} />
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11px] text-green font-medium">{userData?.green_ratings || 0}</span>
              <span className="text-[10px] text-text-muted">·</span>
              <span className="text-[11px] text-red font-medium">{userData?.red_ratings || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

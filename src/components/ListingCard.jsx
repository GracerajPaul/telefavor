"use client";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import Badge from "./Badge";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ListingCard({ listing, userData, onClick }) {
  const router = useRouter();
  if (!listing || !userData) return null;

  const handleClick = () => {
    if (onClick) onClick();
    else router.push(`/listing/${listing.id}`);
  };

  const totalRatings = (userData.green_ratings || 0) + (userData.red_ratings || 0);

  return (
    <button
      onClick={handleClick}
      className="ripple w-full flex items-center gap-3 px-4 py-3 bg-[#151230] active:brightness-110 transition-all"
    >
      <Avatar
        src={userData.photo_url}
        name={userData.display_name}
        size={48}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/user/${listing.user_id}`);
          }}
      />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-semibold text-white truncate">
            {userData.display_name || "Unknown"}
          </span>
        </div>
        <p className="text-[14px] text-white font-medium truncate">
          {listing.title}
        </p>
        <div className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
          <span>@{listing.telegram_username}</span>
          <span>·</span>
          <span>{timeAgo(listing.posted_at)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <Badge
          level={userData.trust_level}
          score={userData.trust_score}
          ratingsCount={totalRatings}
        />
        <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
          <span className="text-[#22C55E]">✅ {userData.green_ratings || 0}</span>
          {" "}
          <span className="text-[#EF4444]">❌ {userData.red_ratings || 0}</span>
        </span>
      </div>
    </button>
  );
}

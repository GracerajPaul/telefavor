\"use client\";
import Avatar from \"./Avatar\";
import Badge from \"./Badge\";
import Icon from \"./Icon\";

export default function ListingCard({ listing, userData, onClick }) {
  const totalRatings = (userData?.green_ratings || 0) + (userData?.red_ratings || 0);
  const trustScore = userData?.trust_score || 0;

  const getScoreColor = (score) => {
    if (score >= 85) return '#34d399';
    if (score >= 65) return '#fbbf24';
    if (score >= 40) return '#f97316';
    return '#f87171';
  };

  const scoreColor = getScoreColor(trustScore);

  return (
    <button
      onClick={onClick}
      className=\"w-full text-left animated-border card-lift\"
      style={{
        background: 'rgba(13,17,30,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '16px',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Header: Avatar + Name + Badge */}
      <div className=\"flex items-start gap-3\">
        <div className=\"relative flex-shrink-0\">
          <Avatar src={userData?.photo_url} name={userData?.display_name} size={38} />
          {/* Online-style trust dot */}
          <span
            className=\"absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2\"
            style={{ background: scoreColor, borderColor: 'rgba(8,11,20,1)' }}
          />
        </div>
        <div className=\"min-w-0 flex-1\">
          <div className=\"flex items-center justify-between gap-2\">
            <p className=\"text-[13px] font-semibold truncate\" style={{ color: 'var(--color-text)' }}>
              {userData?.display_name || \"Unknown\"}
            </p>
            <Badge level={null} score={trustScore} ratingsCount={totalRatings} />
          </div>
          <p className=\"text-[12px] mt-0.5 truncate\" style={{ color: 'var(--color-primary)' }}>
            @{listing.telegram_username}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className=\"section-divider my-3\" />

      {/* Content */}
      <div>
        <p className=\"text-[13px] font-semibold\" style={{ color: 'var(--color-text)' }}>
          {listing.title}
        </p>
        {listing.message && (
          <p className=\"text-[12px] mt-1 line-clamp-2 leading-relaxed\" style={{ color: 'var(--color-text-secondary)' }}>
            {listing.message}
          </p>
        )}
      </div>

      {/* Footer Stats */}
      <div className=\"flex items-center justify-between mt-3\">
        <div className=\"flex items-center gap-3\">
          <span className=\"flex items-center gap-1.5 text-[11px]\" style={{ color: 'var(--color-text-muted)' }}>
            <Icon name=\"clock\" size={10} />
            {listing.posted_at
              ? new Date(listing.posted_at).toLocaleDateString(\"en-US\", { month: \"short\", day: \"numeric\", hour: \"2-digit\", minute: \"2-digit\" })
              : \"Recently\"}
          </span>
          <span className=\"flex items-center gap-1.5 text-[11px]\" style={{ color: 'var(--color-text-muted)' }}>
            <Icon name=\"users\" size={10} />
            {listing.contact_taps || 0} taps
          </span>
        </div>

        {/* Trust Score mini pill */}
        {totalRatings >= 1 && (
          <span
            className=\"text-[10px] font-bold px-2 py-0.5 rounded-full\"
            style={{
              color: scoreColor,
              background: `${scoreColor}18`,
              border: `1px solid ${scoreColor}30`,
            }}
          >
            {trustScore}%
          </span>
        )}
      </div>
    </button>
  );
}

\"use client\";

const AVATAR_COLORS = [
  [\"#5b8def\", \"#3a6fd4\"],
  [\"#9b73f0\", \"#7c5cc4\"],
  [\"#22d3ee\", \"#0ea5c9\"],
  [\"#34d399\", \"#10b981\"],
  [\"#f87171\", \"#ef4444\"],
  [\"#fbbf24\", \"#f59e0b\"],
  [\"#a78bfa\", \"#8b5cf6\"],
  [\"#fb923c\", \"#f97316\"],
];

function hashColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Avatar({ src, name, size = 40, onClick }) {
  const initials = (name || \"?\")
    .split(\" \")
    .map((w) => w[0])
    .join(\"\")
    .toUpperCase()
    .slice(0, 2);

  const [c1, c2] = hashColor(name);
  const fontSize = Math.max(10, size * 0.36);

  const style = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1.5px solid rgba(255,255,255,0.08)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
  };

  if (src) {
    return (
      <button onClick={onClick} disabled={!onClick} style={style}>
        <img src={src} alt={name || \"\"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        ...style,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </button>
  );
}

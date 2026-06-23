"use client";
const AVATAR_COLORS = [
  ["#FF6B35", "#E55A2B"],
  ["#8B5CF6", "#7C3AED"],
  ["#22C55E", "#16A34A"],
  ["#F59E0B", "#D97706"],
  ["#EF4444", "#DC2626"],
  ["#3B82F6", "#2563EB"],
  ["#EC4899", "#DB2777"],
  ["#14B8A6", "#0D9488"],
];

function hashColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Avatar({ src, name, size = 40, onClick }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [c1] = hashColor(name);
  const fontSize = Math.max(10, size * 0.36);

  if (src) {
    return (
      <button onClick={onClick} disabled={!onClick} style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)", flexShrink: 0, cursor: onClick ? "pointer" : "default" }}>
        <img src={src} alt={name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        width: size, height: size, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.08)", flexShrink: 0,
        cursor: onClick ? "pointer" : "default", background: c1, display: "flex", alignItems: "center",
        justifyContent: "center", color: "#fff", fontSize, fontWeight: 600, letterSpacing: "0.02em",
      }}
    >
      {initials}
    </button>
  );
}

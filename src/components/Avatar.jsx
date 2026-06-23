"use client";

const AVATAR_COLORS = [
  "#0842A0", "#1a5bb5", "#2d74c9", "#408ddd",
  "#0d6b3e", "#1a8c54", "#f59e0b", "#d97706",
  "#9333ea", "#7c3aed", "#dc2626", "#2563eb",
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

  const bgColor = hashColor(name);

  if (src) {
    return (
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`rounded-full overflow-hidden border border-border flex-shrink-0 ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
        style={{ width: size, height: size }}
      >
        <img src={src} alt={name || ""} className="w-full h-full object-cover" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`rounded-full flex items-center justify-center font-medium text-white flex-shrink-0 ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
      style={{ width: size, height: size, fontSize: size * 0.4, backgroundColor: bgColor }}
    >
      {initials}
    </button>
  );
}

export default function Avatar({ src, name, size = 48, onClick }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const colors = ["#06B6D4", "#22C55E", "#F59E0B", "#EF4444", "#F6C000", "#94A3B8", "#1D1940"];
  const colorIndex = (name || "").length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(e); } : undefined}
      className="flex-shrink-0 rounded-full overflow-hidden ripple"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name || "avatar"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white font-semibold"
          style={{ background: bgColor, fontSize: size * 0.4 }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

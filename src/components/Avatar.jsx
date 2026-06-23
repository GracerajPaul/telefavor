export default function Avatar({ src, name, size = 40, onClick }) {
  const colors = [
    "#06B6D4", "#0EA5E9", "#22C55E", "#F59E0B",
    "#EF4444", "#8B5CF6", "#EC4899",
  ];
  const colorIndex = (name || "").length % colors.length;
  const bg = colors[colorIndex];
  const initial = (name || "?").charAt(0).toUpperCase();
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className="rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border hover:ring-primary/30 transition-all duration-200 active:scale-95"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-[15px] select-none" style={{ background: bg }}>
          {initial}
        </div>
      )}
    </Component>
  );
}

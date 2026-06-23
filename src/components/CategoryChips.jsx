import Icon from "./Icon";

export default function CategoryChips({ selected, onSelect }) {
  const categories = ["", "Telegram Channel", "Telegram Group", "Telegram Bot", "Telegram Mini App", "TON", "Other"];

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat, i) => {
        const isActive = selected === cat;
        const label = cat || "All";
        return (
          <button key={i} onClick={() => onSelect(isActive ? "" : cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${isActive ? "bg-accent text-white border-accent" : "bg-bg-card text-text-muted border-border hover:bg-bg-hover hover:text-text"}`}>
            {i === 0 && <Icon name="filter" size={10} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

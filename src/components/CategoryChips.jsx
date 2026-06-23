"use client";
import Icon from "./Icon";

const categories = [
  "",
  "Telegram Channel",
  "Telegram Group",
  "Telegram Bot",
  "Telegram Mini App",
  "TON",
  "Other",
];

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat, i) => {
        const isActive = selected === cat;
        return (
          <button
            key={i}
            onClick={() => onSelect(isActive ? "" : cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors border ${
              isActive
                ? "bg-primary-soft text-primary border-primary-soft"
                : "bg-transparent text-text-muted border-border hover:bg-bg-hover hover:text-text-secondary"
            }`}
          >
            {i === 0 && <Icon name="filter" size={12} />}
            {cat || "All"}
          </button>
        );
      })}
    </div>
  );
}

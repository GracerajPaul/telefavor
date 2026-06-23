"use client";
import { useRef } from "react";
import { LISTING_TITLES } from "../services/database";
import Icon from "./Icon";

export default function CategoryChips({ selected, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const chips = ["All", ...LISTING_TITLES];

  return (
    <div className="relative group">
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-bg-card border border-border items-center justify-center hidden group-hover:flex hover:bg-bg-elevated transition-all shadow-lg">
        <Icon name="chevronLeft" size={16} />
      </button>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onSelect(chip === "All" ? "" : chip)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 active:scale-95 ${
              selected === chip || (!selected && chip === "All")
                ? "bg-primary text-white shadow-lg shadow-primary-glow/30"
                : "bg-bg-elevated text-text-secondary hover:text-text hover:bg-border"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-bg-card border border-border items-center justify-center hidden group-hover:flex hover:bg-bg-elevated transition-all shadow-lg">
        <Icon name="chevronRight" size={16} />
      </button>
    </div>
  );
}

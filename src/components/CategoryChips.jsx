"use client";
import { useRef } from "react";
import { LISTING_TITLES } from "../services/database";

export default function CategoryChips({ selected, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => scroll("left")}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#151230] border border-[#1E1B3A] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1D1940] transition-all active:scale-90"
        aria-label="Scroll left"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 py-1">
        <button
          onClick={() => onSelect("All")}
          aria-pressed={selected === "All"}
          className={`ripple flex-shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 active:scale-95 ${
            selected === "All"
              ? "bg-[#06B6D4] text-white shadow-lg shadow-[#06B6D4]/30"
              : "bg-[#151230] text-[#94A3B8] hover:bg-[#1D1940]"
          }`}
        >
          All
        </button>
        {LISTING_TITLES.map((title) => {
          const active = selected === title;
          return (
            <button
              key={title}
              onClick={() => onSelect(title)}
              aria-pressed={active}
              className={`ripple flex-shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 active:scale-95 ${
                active
                  ? "bg-[#06B6D4] text-white shadow-lg shadow-[#06B6D4]/30"
                  : "bg-[#151230] text-[#94A3B8] hover:bg-[#1D1940]"
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => scroll("right")}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#151230] border border-[#1E1B3A] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1D1940] transition-all active:scale-90"
        aria-label="Scroll right"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";

export default function BottomSheet({ isOpen, onClose, children, title }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={onClose} />
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg bg-bg-dark border border-border rounded-t-2xl animate-fadeIn max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-bg-dark border-b border-border z-10 px-4 py-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-text">{title || ""}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

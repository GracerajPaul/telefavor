"use client";
import { useEffect, useRef } from "react";

export default function BottomSheet({ isOpen, onClose, children, title }) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const offsetY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    offsetY.current = 0;
  };
  const handleTouchMove = (e) => {
    offsetY.current = e.touches[0].clientY - startY.current;
    if (offsetY.current > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${offsetY.current}px)`;
    }
  };
  const handleTouchEnd = () => {
    if (offsetY.current > 100) onClose();
    if (sheetRef.current) sheetRef.current.style.transform = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fadeIn" onClick={onClose} />
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg bg-bg-card rounded-t-2xl border border-border animate-slideInUp transition-transform duration-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="drag-handle" />
        {title && (
          <div className="px-5 pb-3">
            <h3 className="text-[16px] font-semibold text-text">{title}</h3>
          </div>
        )}
        <div className="px-5 pb-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}

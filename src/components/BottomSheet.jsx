import { useEffect, useRef } from "react";

export default function BottomSheet({ isOpen, onClose, children, title }) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    dragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;
    currentY.current = e.touches[0].clientY - startY.current;
    if (currentY.current > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${currentY.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    if (currentY.current > 100 && sheetRef.current) {
      sheetRef.current.style.transform = "";
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentY.current = 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 fade-in" onClick={onClose} />
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg bg-[#151230] rounded-t-2xl slide-in transition-transform duration-200 ease-out"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="drag-handle" />
        {title && (
          <div className="px-6 pb-2">
            <h2 className="text-[17px] font-semibold text-white text-center">{title}</h2>
          </div>
        )}
        <div className="px-6 pb-8 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

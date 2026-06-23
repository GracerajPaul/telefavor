"use client";
import { useRouter } from "next/navigation";

export default function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-bg border border-border rounded-t-2xl p-5">
        {children}
      </div>
    </div>
  );
}

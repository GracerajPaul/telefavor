"use client";
import { useRouter } from "next/navigation";

export default function Header({ title, rightAction, onBack, backArrow = true }) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <div className="bg-[#0D0B1A] px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#1E1B3A]">
      <div className="w-10 flex items-center">
        {backArrow && (
          <button onClick={handleBack} className="ripple p-1 -ml-1 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <h1 className="text-[17px] font-semibold text-white flex-1 text-center">{title}</h1>
      <div className="w-10 flex items-center justify-end">
        {rightAction || <div />}
      </div>
    </div>
  );
}

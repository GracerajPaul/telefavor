"use client";
import { useRouter } from "next/navigation";
import Icon from "./Icon";

export default function Header({ title, rightAction, onBack, backArrow = true }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-xl -mx-4 md:-mx-8 px-4 md:px-8 mb-4">
      <div className="flex items-center justify-between h-12 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          {backArrow && (
            <button
              onClick={onBack || (() => router.back())}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-bg-elevated transition-all active:scale-90 flex-shrink-0"
            >
              <Icon name="arrowLeft" size={18} />
            </button>
          )}
          <h1 className="text-[16px] font-semibold text-text truncate">{title}</h1>
        </div>
        {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
      </div>
    </div>
  );
}

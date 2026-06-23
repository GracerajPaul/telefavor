"use client";
import BottomSheet from "./BottomSheet";
import Icon from "./Icon";

export default function RatingSheet({ isOpen, onClose, username, onRate, onSkip, loading }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Rate this swap">
      <div className="space-y-3">
        <p className="text-[13px] text-text-secondary leading-relaxed">
          How was your swap with <span className="text-text font-medium">@{username}</span>?
        </p>
        <button
          onClick={() => onRate("green")}
          disabled={loading}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-green-soft text-green font-semibold text-[14px] hover:bg-green-soft/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center">
            <Icon name="thumbsUp" size={18} className="text-white" />
          </div>
          Successful Swap
        </button>
        <button
          onClick={() => onRate("red")}
          disabled={loading}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-soft text-red font-semibold text-[14px] hover:bg-red-soft/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-lg bg-red flex items-center justify-center">
            <Icon name="x" size={18} className="text-white" />
          </div>
          Not Successful
        </button>
        <button
          onClick={onSkip}
          disabled={loading}
          className="w-full text-center py-3 text-[13px] text-text-muted hover:text-text-secondary transition-colors"
        >
          Skip
        </button>
      </div>
    </BottomSheet>
  );
}

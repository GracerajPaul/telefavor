"use client";
import Icon from "./Icon";

export default function RatingSheet({ isOpen, onClose, username, onRate, onSkip, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-bg-dark border border-border rounded-t-2xl animate-fadeIn p-5">
        <div className="text-center mb-5">
          <div className="text-center">
            <p className="text-[15px] font-semibold text-text">How was your swap?</p>
            <p className="text-[13px] text-text-secondary mt-1">with @{username}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onRate("green")}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-green/30 text-green text-[14px] font-semibold hover:bg-green/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon name="check" size={16} />
            Successful
          </button>
          <button
            onClick={() => onRate("red")}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-red/30 text-red text-[14px] font-semibold hover:bg-red/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon name="x" size={16} />
            Not Successful
          </button>
        </div>
        <button
          onClick={onSkip}
          disabled={loading}
          className="w-full mt-3 py-2.5 rounded-xl text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

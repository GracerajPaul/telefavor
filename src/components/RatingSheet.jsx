import { useState } from "react";
import BottomSheet from "./BottomSheet";

export default function RatingSheet({
  isOpen,
  onClose,
  username,
  onRate,
  onSkip,
  loading,
}) {
  const handleRate = async (result) => {
    await onRate(result);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-2 mb-6">
        <p className="text-[17px] font-semibold text-white">
          How was your swap with @{username}?
        </p>
        <p className="text-[13px] text-[#94A3B8]">
          Your rating builds their trust score
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleRate("green")}
          disabled={loading}
          className="ripple w-full py-4 rounded-xl bg-[#22C55E] text-white text-[16px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="text-[20px]">🟢</span> Successful Swap
        </button>
        <button
          onClick={() => handleRate("red")}
          disabled={loading}
          className="ripple w-full py-4 rounded-xl bg-[#EF4444] text-white text-[16px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="text-[20px]">🔴</span> Not Successful
        </button>
      </div>

      <button
        onClick={onSkip}
        className="w-full text-center text-[14px] text-[#94A3B8] py-4 mt-2 ripple rounded-xl"
      >
        Skip
      </button>
    </BottomSheet>
  );
}

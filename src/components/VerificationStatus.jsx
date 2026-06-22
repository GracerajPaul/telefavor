"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { generateVerificationCode, checkVerification } from "../services/database";

export default function VerificationStatus({ onVerified, autoGenerate }) {
  const { user: fbUser, profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState("idle");
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [verifying, setVerifying] = useState(false);
  const autoTriggered = useRef(false);

  const isVerified = profile?.telegram_verified;

  useEffect(() => {
    if (isVerified) setStep("done");
  }, [isVerified]);

  useEffect(() => {
    if (autoGenerate && !autoTriggered.current && !isVerified && fbUser && profile?.telegram_username) {
      autoTriggered.current = true;
      setVerifying(true);
      (async () => {
        try {
          const result = await generateVerificationCode(fbUser.id, profile.telegram_username);
          setCode(result.code);
          setExpiresAt(new Date(result.expires_at));
          setStep("waiting");
        } catch (err) {
          toast("Failed: " + (err.message || "unknown error"), "error");
        } finally {
          setVerifying(false);
        }
      })();
    }
  }, [autoGenerate, isVerified, fbUser, profile?.telegram_username, toast]);

  const handleGenerate = async () => {
    if (!fbUser || !profile?.telegram_username) return;
    setVerifying(true);
    try {
      const result = await generateVerificationCode(fbUser.id, profile.telegram_username);
      setCode(result.code);
      setExpiresAt(new Date(result.expires_at));
      setStep("waiting");
    } catch (err) {
      toast("Failed: " + (err.message || "unknown error"), "error");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (step !== "waiting") return;
    const interval = setInterval(async () => {
      if (!fbUser) return;
      const result = await checkVerification(fbUser.id);
      if (result?.verified) {
        setStep("done");
        await refreshProfile();
        toast("Telegram account verified!");
        onVerified?.();
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [step, fbUser, refreshProfile, toast, onVerified]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(`${Math.floor(diff / 60)}:${String(diff % 60).padStart(2, "0")}`);
      if (diff <= 0) setStep("expired");
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (step === "done" || isVerified) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-[#22C55E]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Verified Telegram Account
      </div>
    );
  }

  if (step === "expired") {
    return (
      <div className="space-y-3">
        <p className="text-[13px] text-[#EF4444]">Code expired. Generate a new one.</p>
        <button onClick={handleGenerate} disabled={verifying} className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[12px] font-medium disabled:opacity-50 active:scale-95 transition-all">
          {verifying ? "Generating..." : "Generate New Code"}
        </button>
      </div>
    );
  }

  if (step === "waiting") {
    return (
      <div className="space-y-3">
        <p className="text-[13px] text-[#94A3B8]">Send the code below to <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline font-semibold">@TelefavorVerificationBot</a> on Telegram:</p>
        <div className="bg-[#0D0B1A] rounded-xl p-4 text-center border border-[#1E1B3A]">
          <span className="text-[24px] font-bold text-[#06B6D4] tracking-widest font-mono">{code}</span>
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#94A3B8]">
          <span>Expires in: <span className="text-white font-mono">{timeLeft}</span></span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
            <span>Waiting for verification...</span>
          </div>
        </div>
        <button onClick={() => setStep("idle")} className="text-[12px] text-[#5A5A7A] hover:text-[#94A3B8] transition-colors">Cancel</button>
      </div>
    );
  }

  return (
    <button onClick={handleGenerate} disabled={verifying} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0B1A] border border-[#1E1B3A] text-[12px] text-[#94A3B8] hover:border-[#06B6D4]/30 hover:text-white transition-all disabled:opacity-50">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C9.38924 20 6.68673 18.1871 5.26782 15.5M3 12.5C3 7.80558 6.80558 4 11.5 4C14.6108 4 17.3133 5.81288 18.7322 8.5" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/><path d="M22 6V10H18M2 18V14H6" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {verifying ? "Generating..." : "Verify Telegram"}
    </button>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { generateVerificationCode as generateCode, checkVerification } from "../services/database";
import Icon from "./Icon";

export default function VerificationStatus({ onVerified, autoGenerate }) {
  const { user: fbUser, profile, refreshProfile } = useAuth();
  const [code, setCode] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);
  const intervalRef = useRef(null);

  const startPolling = () => {
    setPolling(true);
    intervalRef.current = setInterval(async () => {
      try {
        const result = await checkVerification(fbUser.id);
        if (result?.verified) {
          clearInterval(intervalRef.current);
          setPolling(false);
          setStatus("verified");
          await refreshProfile();
          if (onVerified) onVerified();
        }
      } catch {} // silently retry
    }, 2000);
  };

  useEffect(() => {
    if (autoGenerate) handleGenerate();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleGenerate = async () => {
    setStatus("generating");
    setError("");
    try {
      const newCode = await generateCode(fbUser.id, profile?.telegram_username || "");
      setCode(newCode);
      setStatus("awaiting");
      startPolling();
    } catch {
      setError("Failed to generate code. Try again.");
      setStatus("idle");
    }
  };

  if (profile?.telegram_verified) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-green">
        <Icon name="check" size={14} />
        Telegram verified
      </div>
    );
  }

  if (status === "generating") {
    return (
      <div className="flex items-center gap-2 text-[13px] text-text-muted">
        <div className="spinner !w-3.5 !h-3.5" />
        Generating code...
      </div>
    );
  }

  if (status === "awaiting" || polling) {
    return (
      <div className="text-center">
        <div className="inline-block px-5 py-3 rounded-lg bg-bg-inset border border-border mb-3">
          <span className="text-[28px] font-mono font-bold text-primary tracking-[8px]">{code || "------"}</span>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          Send this code to{" "}
          <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-link hover:text-link-hover">@TelefavorVerificationBot</a>
          {" "}on Telegram
        </p>
        {polling && <div className="flex items-center justify-center gap-2 mt-3 text-[12px] text-text-muted"><div className="spinner !w-3 !h-3" />Waiting for verification...</div>}
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="flex items-center gap-2 text-[13px] text-green">
        <Icon name="check" size={14} />
        Verified
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {error && <p className="text-[12px] text-red">{error}</p>}
      <button onClick={handleGenerate} className="px-4 py-2 rounded-lg border border-border text-[13px] text-text-secondary hover:bg-bg-hover hover:text-text transition-colors">
        Generate Verification Code
      </button>
    </div>
  );
}

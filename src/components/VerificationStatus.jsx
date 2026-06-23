"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import { generateVerificationCode, checkVerification } from "../services/database";
import Icon from "./Icon";

const POLL_INTERVAL = 3000;
const CODE_EXPIRY = 10 * 60 * 1000;

export default function VerificationStatus({ onVerified, autoGenerate }) {
  const { user: fbUser } = useAuth();
  const toast = useToast();
  const [state, setState] = useState("idle");
  const [code, setCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const pollRef = useRef(null);

  const startPolling = useCallback(async () => {
    if (!fbUser) return;
    const check = async () => {
      try {
        const result = await checkVerification(fbUser.id);
        if (result) {
          clearInterval(pollRef.current);
          setState("done");
          onVerified?.();
        }
      } catch {}
    };
    check();
    pollRef.current = setInterval(check, POLL_INTERVAL);
  }, [fbUser, onVerified]);

  useEffect(() => {
    if (autoGenerate) handleGenerate();
  }, []);

  useEffect(() => {
    if (state === "waiting") {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            clearInterval(pollRef.current);
            setState("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  const handleGenerate = async () => {
    if (!fbUser) return;
    try {
      const data = await generateVerificationCode(fbUser.id, fbUser.telegram_username || "");
      setCode(data.code);
      setTimeLeft(Math.floor(CODE_EXPIRY / 1000));
      setState("waiting");
      startPolling();
    } catch {
      toast("Failed to generate code", "error");
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-green-soft text-green text-[13px] font-medium">
        <Icon name="verified" size={18} />
        Verified Telegram Account
      </div>
    );
  }

  if (state === "waiting" && code) {
    return (
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-[28px] font-bold tracking-[6px] text-primary font-mono">{code}</p>
          <p className="text-[11px] text-text-muted mt-1.5">Expires in {formatTime(timeLeft)}</p>
        </div>
        <p className="text-[12px] text-text-secondary text-center leading-relaxed">
          Send this code to{' '}
          <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            @TelefavorVerificationBot
          </a>
        </p>
      </div>
    );
  }

  if (state === "expired") {
    return (
      <button onClick={handleGenerate} className="w-full py-2.5 rounded-xl bg-bg-elevated text-text-secondary text-[13px] font-medium hover:text-text hover:bg-border transition-all active:scale-[0.98]">
        Generate New Code
      </button>
    );
  }

  return (
    <button onClick={handleGenerate} className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-all active:scale-[0.98] shadow-lg shadow-primary-glow/20 flex items-center justify-center gap-2">
      <Icon name="telegram" size={16} />
      Verify Telegram
    </button>
  );
}

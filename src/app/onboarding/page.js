"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateUser } from "../../services/database";
import { signOut } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import VerificationStatus from "../../components/VerificationStatus";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: fbUser, profile, loading, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("username");

  const redirected = useRef(false);

  useEffect(() => {
    if (profile?.telegram_username) setUsername(profile.telegram_username);
  }, [profile?.telegram_username]);

  useEffect(() => {
    if (loading || redirected.current) return;
    if (!fbUser) { redirected.current = true; router.replace("/"); }
    else if (profile?.telegram_verified) { redirected.current = true; router.replace("/explore"); }
    else if (profile?.has_onboarded || searchParams.get("verify")) setStep("verify");
  }, [loading, fbUser, profile, router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = username.replace(/^@/, "").trim();
    if (!cleaned) { setError("Please enter your Telegram username"); return; }
    setSaving(true);
    setError("");
    try {
      await updateUser(fbUser.id, { telegram_username: cleaned, has_onboarded: true });
      await refreshProfile();
      setStep("verify");
    } catch { setError("Failed to save. Try again."); } finally { setSaving(false); }
  };

  const handleVerified = () => {
    redirected.current = true;
    router.push("/explore");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded overflow-hidden border border-border">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Telefavor</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => signOut()} className="text-[12px] text-text-muted hover:text-red transition-colors">Sign Out</button>
          <button onClick={() => router.push("/")} className="text-[12px] text-text-muted hover:text-text-secondary transition-colors">Back to Home</button>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4 pt-20 md:pt-28">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 w-full">
            {step === "username" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium mb-6">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                  One more step
                </div>
                <h1 className="text-h1 text-text mb-4">
                  Your Telegram<br />
                  <span className="text-accent">Username</span>
                </h1>
                <p className="text-body mb-8 max-w-md">So others can find and contact you directly on Telegram.</p>
                <div className="bg-bg-card border border-border rounded-xl p-5 max-w-sm">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[12px] text-text-muted font-medium ml-1">Telegram Username</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[14px]">@</span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-bg-hover text-text text-[14px] rounded-lg pl-7 pr-3 py-2.5 outline-none border border-border focus:border-accent transition-colors placeholder:text-text-muted" autoFocus maxLength={32} />
                      </div>
                      {error && <p className="text-red text-[11px] ml-1">{error}</p>}
                    </div>
                    <button type="submit" disabled={saving || !username.trim()}
                      className="w-full py-2.5 rounded-lg bg-accent text-white text-[13px] font-semibold disabled:opacity-40 transition-opacity hover:bg-accent-hover flex items-center justify-center gap-2">
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Continue"}
                    </button>
                  </form>
                </div>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium mb-6">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  Verify your Telegram
                </div>
                <h1 className="text-h1 text-text mb-4">
                  Prove it's <span className="text-accent">You</span>
                </h1>
                <p className="text-body mb-8 max-w-md">
                  Message the code below to{" "}
                  <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">@TelefavorVerificationBot</a>{" "}
                  on Telegram to prove you own <strong className="text-text">@{profile?.telegram_username}</strong>.
                  <button onClick={() => setStep("username")} className="ml-2 text-[11px] text-text-muted hover:text-accent underline transition-colors">Edit</button>
                </p>
                <div className="bg-bg-card border border-border rounded-xl p-5 max-w-sm">
                  <VerificationStatus onVerified={handleVerified} autoGenerate />
                </div>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-bg-card border border-border rounded-2xl p-8 text-center max-w-[280px]">
              {step === "username" ? (
                <>
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  </div>
                  <p className="text-text text-[14px] font-medium">Connect via Telegram</p>
                  <p className="text-[12px] text-text-secondary mt-2 max-w-[200px] mx-auto">Others will reach you directly through your @username</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-bg-hover rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <p className="text-text text-[14px] font-medium">Verify Ownership</p>
                  <p className="text-[12px] text-text-secondary mt-2 max-w-[200px] mx-auto">Send the code to the bot to prove you own this Telegram account</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-32 px-4 py-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <p>Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="hover:text-text-secondary transition-colors">Features</button>
            <button onClick={() => router.push("/community")} className="hover:text-text-secondary transition-colors">Community</button>
            <button onClick={() => router.push("/terms")} className="hover:text-text-secondary transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><div className="spinner" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

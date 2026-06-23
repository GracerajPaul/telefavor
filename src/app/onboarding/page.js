"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateUser } from "../../services/database";
import { signOut } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import VerificationStatus from "../../components/VerificationStatus";
import Icon from "../../components/Icon";

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
    else if (profile?.has_onboarded) setStep("verify");
  }, [loading, fbUser, profile, router]);

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
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      <nav className="flex items-center justify-between px-4 md:px-[141px] py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded overflow-hidden ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-semibold text-text tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Telefavor</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => signOut()} className="text-[12px] text-text-muted hover:text-red transition-colors">Sign Out</button>
          <button onClick={() => router.push("/")} className="text-[12px] text-text-muted hover:text-text-secondary transition-colors">Back to Home</button>
        </div>
      </nav>

      <section className="px-4 md:px-[141px] pt-20 md:pt-28" style={{ marginBottom: "250px" }}>
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 animate-fadeIn w-full">
            {step === "username" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-[11px] font-medium mb-6">
                  <Icon name="clock" size={12} />
                  One more step
                </div>
                <h1 className="text-[36px] md:text-[46px] font-light text-text leading-[1.05] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Your Telegram<br />
                  <span className="text-primary" style={{ fontWeight: 400 }}>Username</span>
                </h1>
                <p className="text-text-secondary text-[14px] max-w-md leading-relaxed mb-8">
                  So others can find and contact you directly on Telegram.
                </p>
                <div className="bg-bg-card border border-border rounded-xl p-5 max-w-sm">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[12px] text-text-muted font-medium ml-1">Telegram Username</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[14px]">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-bg-inset text-text text-[14px] rounded-lg pl-7 pr-3 py-2.5 outline-none border border-border focus:border-primary transition-colors placeholder:text-text-muted"
                          autoFocus
                          maxLength={32}
                        />
                      </div>
                      {error && <p className="text-red text-[11px] ml-1">{error}</p>}
                    </div>
                    <button type="submit" disabled={saving || !username.trim()} className="w-full py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold disabled:opacity-40 transition-opacity hover:bg-primary-hover flex items-center justify-center gap-2">
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Continue
                          <Icon name="chevron-right" size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-[11px] font-medium mb-6">
                  <Icon name="send" size={12} />
                  Verify your Telegram
                </div>
                <h1 className="text-[36px] md:text-[46px] font-light text-text leading-[1.05] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Prove it's <span className="text-primary" style={{ fontWeight: 400 }}>You</span>
                </h1>
                <p className="text-text-secondary text-[14px] max-w-md leading-relaxed mb-8">
                  Message the code below to{" "}
                  <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-link hover:text-link-hover">@TelefavorVerificationBot</a>{" "}
                  on Telegram to prove you own <strong className="text-text">@{profile?.telegram_username}</strong>.
                  <button onClick={() => setStep("username")} className="ml-2 text-[11px] text-text-muted hover:text-link underline transition-colors">Edit</button>
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
                  <div className="w-14 h-14 bg-primary-soft rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="send" size={24} className="text-primary" />
                  </div>
                  <p className="text-text text-[14px] font-medium">Connect via Telegram</p>
                  <p className="text-[12px] text-text-secondary mt-2 max-w-[200px] mx-auto leading-relaxed">Others will reach you directly through your @username</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-bg-inset rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="check" size={24} className="text-green" />
                  </div>
                  <p className="text-text text-[14px] font-medium">Verify Ownership</p>
                  <p className="text-[12px] text-text-secondary mt-2 max-w-[200px] mx-auto leading-relaxed">Send the code to the bot to prove you own this Telegram account</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 md:px-[141px] py-6">
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
    <Suspense fallback={<div className="min-h-screen bg-bg-dark flex items-center justify-center"><div className="spinner" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

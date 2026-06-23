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

  const needsVerify = searchParams.get("verify") === "1" || profile?.has_onboarded;

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
    <div className="min-h-screen bg-bg-dark bg-grid">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[17px] font-bold text-text">Telefavor</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => signOut()} className="text-[13px] text-text-muted hover:text-red transition-colors">Sign Out</button>
          <button onClick={() => router.push("/")} className="text-[13px] text-text-muted hover:text-text-secondary transition-colors">Back to Home</button>
        </div>
      </nav>

      <section className="px-4 md:px-8 pt-16 md:pt-20 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 animate-fadeIn w-full">
            {step === "username" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-[12px] font-medium mb-5">
                  <Icon name="clock" size={14} />
                  One more step
                </div>
                <h1 className="text-[36px] md:text-[46px] font-bold text-text leading-[1.1] mb-4">
                  Your Telegram<br />
                  <span className="text-primary">Username</span>
                </h1>
                <p className="text-text-secondary text-[15px] max-w-md leading-relaxed mb-8">
                  So others can find and contact you directly on Telegram.
                </p>
                <div className="bg-bg-card rounded-2xl border border-border p-5 max-w-sm">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[13px] text-text-muted font-medium ml-1">Telegram Username</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[15px]">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-bg-inset text-text text-[15px] rounded-xl pl-8 pr-4 py-3 outline-none border border-border focus:border-primary transition-all duration-200 placeholder:text-text-muted"
                          autoFocus
                          maxLength={32}
                        />
                      </div>
                      {error && <p className="text-red text-[12px] ml-1">{error}</p>}
                    </div>
                    <button type="submit" disabled={saving || !username.trim()} className="ripple w-full py-3 rounded-xl bg-primary text-white text-[14px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Continue
                          <Icon name="chevron-right" size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-[12px] font-medium mb-5">
                  <Icon name="send" size={14} />
                  Verify your Telegram
                </div>
                <h1 className="text-[36px] md:text-[46px] font-bold text-text leading-[1.1] mb-4">
                  Prove it's <span className="text-primary">You</span>
                </h1>
                <p className="text-text-secondary text-[15px] max-w-md leading-relaxed mb-8">
                  Message the code below to{" "}
                  <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">@TelefavorVerificationBot</a>{" "}
                  on Telegram to prove you own <strong className="text-text">@{profile?.telegram_username}</strong>.
                  <button onClick={() => setStep("username")} className="ml-2 text-[12px] text-text-muted hover:text-primary underline transition-colors">Edit</button>
                </p>
                <div className="bg-bg-card rounded-2xl border border-border p-5 max-w-sm">
                  <VerificationStatus onVerified={handleVerified} autoGenerate />
                </div>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 animate-fadeIn">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full animate-pulseGlow" />
              <div className="absolute inset-4 bg-bg-card rounded-full border border-border flex items-center justify-center">
                <div className="text-center">
                  {step === "username" ? (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-glow/30">
                        <Icon name="send" size={28} className="text-white" />
                      </div>
                      <p className="text-text text-[15px] font-medium">Connect via Telegram</p>
                      <p className="text-[13px] text-text-secondary mt-2 max-w-[200px] mx-auto leading-relaxed">Others will reach you directly through your @username</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-green to-[#16A34A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green/30">
                        <Icon name="check" size={28} className="text-white" />
                      </div>
                      <p className="text-text text-[15px] font-medium">Verify Ownership</p>
                      <p className="text-[13px] text-text-secondary mt-2 max-w-[200px] mx-auto leading-relaxed">Send the code to the bot to prove you own this Telegram account</p>
                    </>
                  )}
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-bg-card rounded-xl border border-border flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "0.5s" }}>
                <Icon name="check" size={22} className="text-green" />
              </div>
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-bg-card rounded-xl border border-border flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "1s" }}>
                <Icon name="clock" size={20} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-text-muted">
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

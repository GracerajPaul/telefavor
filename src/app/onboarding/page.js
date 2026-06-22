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
  const { user: fbUser, profile, loading, refreshProfile, isAuthenticated } = useAuth();
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
      <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0B1A] bg-grid">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Telefavor" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-[18px] font-bold text-white">Telefavor</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => signOut()} className="text-[14px] text-[#94A3B8] hover:text-[#EF4444] transition-colors">Sign Out</button>
          <button onClick={() => router.push("/")} className="text-[14px] text-[#94A3B8] hover:text-white transition-colors">Back to Home</button>
        </div>
      </nav>

      {/* Onboarding Section */}
      <section className="px-6 md:px-12 pt-16 md:pt-20 pb-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Left Column — Form */}
          <div className="flex-1 animate-fadeIn w-full">
            {step === "username" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-[13px] font-medium mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#06B6D4" strokeWidth="1.8"/><path d="M12 8V12L15 15" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  One more step
                </div>
                <h1 className="text-[42px] md:text-[48px] font-bold text-white leading-[1.1] mb-4">
                  Your Telegram<br />
                  <span className="text-[#06B6D4]">Username</span>
                </h1>
                <p className="text-[#94A3B8] text-[16px] max-w-md leading-relaxed mb-8">
                  So others can find and contact you directly on Telegram.
                </p>
                <div className="bg-[#151230] rounded-2xl border border-[#1E1B3A] p-6 max-w-sm">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[13px] text-[#94A3B8] font-medium ml-1">Telegram Username</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[16px]">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-[#0D0B1A] text-white text-[16px] rounded-xl pl-9 pr-4 py-3.5 outline-none border border-transparent focus:border-[#06B6D4] transition-all duration-200 placeholder:text-[#94A3B8]"
                          autoFocus
                          maxLength={32}
                        />
                      </div>
                      {error && <p className="text-[#EF4444] text-[12px] ml-1">{error}</p>}
                    </div>
                    <button type="submit" disabled={saving || !username.trim()} className="ripple w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[15px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-all duration-200 hover:shadow-lg hover:shadow-[#06B6D4]/30 flex items-center justify-center gap-2">
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Continue
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-[13px] font-medium mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C9.38924 20 6.68673 18.1871 5.26782 15.5M3 12.5C3 7.80558 6.80558 4 11.5 4C14.6108 4 17.3133 5.81288 18.7322 8.5" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/><path d="M22 6V10H18M2 18V14H6" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Verify your Telegram
                </div>
                <h1 className="text-[42px] md:text-[48px] font-bold text-white leading-[1.1] mb-4">
                  Prove it's <span className="text-[#06B6D4]">You</span>
                </h1>
                <p className="text-[#94A3B8] text-[16px] max-w-md leading-relaxed mb-8">
                  Message the code below to <a href="https://t.me/TelefavorVerificationBot" target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline font-semibold">@TelefavorVerificationBot</a> on Telegram to prove you own <strong className="text-white">@{profile?.telegram_username}</strong>.
                  <button onClick={() => setStep("username")} className="ml-2 text-[12px] text-[#94A3B8] hover:text-[#06B6D4] underline transition-colors">Edit</button>
                </p>
                <div className="bg-[#151230] rounded-2xl border border-[#1E1B3A] p-6 max-w-sm">
                  <VerificationStatus onVerified={handleVerified} autoGenerate />
                </div>
              </>
            )}
          </div>

          {/* Right Column — Visual */}
          <div className="hidden md:flex items-center justify-center flex-1 animate-fadeIn">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 via-[#0EA5E9]/10 to-transparent rounded-full animate-pulseGlow" />
              <div className="absolute inset-4 bg-[#151230] rounded-full border border-[#1E1B3A] flex items-center justify-center">
                <div className="text-center">
                  {step === "username" ? (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#06B6D4]/30">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C9.38924 20 6.68673 18.1871 5.26782 15.5M3 12.5C3 7.80558 6.80558 4 11.5 4C14.6108 4 17.3133 5.81288 18.7322 8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M22 6V10H18M2 18V14H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-white text-[15px] font-medium">Connect via Telegram</p>
                      <p className="text-[13px] text-[#94A3B8] mt-2 max-w-[200px] mx-auto leading-relaxed">Others will reach you directly through your @username</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#22C55E]/30">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="text-white text-[15px] font-medium">Verify Ownership</p>
                      <p className="text-[13px] text-[#94A3B8] mt-2 max-w-[200px] mx-auto leading-relaxed">Send the code to the bot to prove you own this Telegram account</p>
                    </>
                  )}
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-[#151230] rounded-xl border border-[#1E1B3A] flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "0.5s" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-[#151230] rounded-xl border border-[#1E1B3A] flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "1s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0EA5E9" strokeWidth="1.5"/><path d="M12 8V12L15 15" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1B3A] px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[13px] text-[#94A3B8]">
          <p>Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => router.push("/terms")} className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center"><div className="spinner" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

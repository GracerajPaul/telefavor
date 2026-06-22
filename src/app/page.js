"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#06B6D4" strokeWidth="1.8"/><path d="M12 8V12L15 15" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: "24h Listings",
    desc: "Post one active listing at a time. Automatically expires after 24 hours.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: "Trust Scores",
    desc: "Every swap earns a rating. Build your reputation with a transparent trust score.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 12C21 13.2 20.5 14.2 19.7 15C18.9 15.8 17.9 16.3 16.7 16.3C14.3 16.3 12.3 14.3 12.3 11.9C12.3 9.5 14.3 7.5 16.7 7.5C17.9 7.5 18.9 8 19.7 8.8" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/><path d="M3 7H11M3 12H8M3 17H5" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: "Direct Telegram",
    desc: "One-tap contact via Telegram. No phone numbers, just your @username.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="#06B6D4" strokeWidth="1.8"/></svg>,
    title: "Verified Reviews",
    desc: "One rating per swap. Honest, actionable feedback you can trust.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#06B6D4" strokeWidth="1.8"/><path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: "Category Filters",
    desc: "Browse by type — channels, bots, games, TON, and more.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#06B6D4" strokeWidth="1.8"/><path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: "Public Profiles",
    desc: "View any user's history and trust score before swapping.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, loading, profileLoading, isAuthenticated, isLoggedIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    if (isAuthenticated) { redirected.current = true; router.replace("/explore"); }
    else if (isLoggedIn && profile && !profile.has_onboarded) { redirected.current = true; router.replace("/onboarding"); }
  }, [isAuthenticated, isLoggedIn, profile, router]);

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) return;
    setSigningIn(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch {
      setError("Failed to sign in. Please try again.");
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B1A]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Telefavor" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-[18px] font-bold text-white">Telefavor</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/features")} className="text-[14px] text-[#94A3B8] hover:text-white transition-colors">Features</button>
          <button onClick={() => router.push("/terms")} className="text-[14px] text-[#94A3B8] hover:text-white transition-colors">Terms</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-[13px] font-medium mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#06B6D4" strokeWidth="1.8"/><path d="M12 8V12L15 15" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Trusted referral exchange network
            </div>
            <h1 className="text-[42px] md:text-[56px] font-bold text-white leading-[1.1] mb-5">
              Swap referrals<br />
              <span className="text-[#06B6D4]">with confidence</span>
            </h1>
            <p className="text-[#94A3B8] text-[17px] max-w-md leading-relaxed mb-8">
              Telefavor connects you with real people for referral exchanges on Telegram.
              Post a listing, find a partner, build your reputation.
            </p>

            {/* Sign-in card */}
            <div className="bg-[#151230] rounded-2xl border border-[#1E1B3A] p-5 max-w-sm">
              {error && <p className="text-[#EF4444] text-[13px] mb-3">{error}</p>}
              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="sr-only" />
                  <div className={"w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center " + (acceptedTerms ? "bg-[#06B6D4] border-[#06B6D4]" : "border-[#1E1B3A] bg-[#0D0B1A] group-hover:border-[#06B6D4]/50")}>
                    {acceptedTerms && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
                <span className="text-[13px] text-[#94A3B8] leading-relaxed select-none">
                  I accept the{" "}
                  <button onClick={(e) => { e.stopPropagation(); router.push("/terms"); }} className="text-[#06B6D4] hover:text-[#0EA5E9] transition-colors underline underline-offset-2">Terms of Service</button>
                </span>
              </label>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn || !acceptedTerms}
                className="ripple w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[15px] font-semibold flex items-center justify-center gap-3 disabled:opacity-40 active:scale-[0.98] transition-all duration-200 hover:shadow-lg hover:shadow-[#06B6D4]/30"
              >
                {signingIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hero graphic */}
          <div className="hidden md:flex items-center justify-center flex-1 animate-fadeIn">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 via-[#0EA5E9]/10 to-transparent rounded-full animate-pulseGlow" />
              <div className="absolute inset-4 bg-[#151230] rounded-full border border-[#1E1B3A] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#06B6D4]/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <p className="text-white text-[15px] font-medium">Trust Score</p>
                  <p className="text-[22px] font-bold text-[#22C55E] mt-1">92%</p>
                  <div className="flex items-center justify-center gap-3 mt-3 text-[12px] text-[#94A3B8]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E]" />12 green</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" />1 red</span>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-[#151230] rounded-xl border border-[#1E1B3A] flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "0.5s" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#22C55E" strokeWidth="1.5"/><path d="M12 8V16M8 12H16" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-[#151230] rounded-xl border border-[#1E1B3A] flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "1s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="absolute top-10 -left-8 w-10 h-10 bg-[#151230] rounded-xl border border-[#1E1B3A] flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: "1.5s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#06B6D4" strokeWidth="1.5"/><path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto border-t border-[#1E1B3A]">
        <div className="text-center mb-14">
          <h2 className="text-[32px] font-bold text-white mb-3">Why Telefavor?</h2>
          <p className="text-[#94A3B8] text-[16px] max-w-lg mx-auto">Built for safe, transparent referral swapping on Telegram</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-5 hover:border-[#06B6D4]/30 transition-all duration-300 card-hover">
              <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-[16px] font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-[13px] text-[#94A3B8] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1B3A] px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-[#94A3B8]">
          <p className="text-center md:text-left">Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => router.push("/terms")} className="hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
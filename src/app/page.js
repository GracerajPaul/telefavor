"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

const features = [
  {
    icon: "clock",
    title: "24h Listings",
    desc: "Post one active listing at a time. Automatically expires after 24 hours.",
  },
  {
    icon: "star",
    title: "Trust Scores",
    desc: "Every swap earns a rating. Build your reputation with a transparent trust score.",
  },
  {
    icon: "send",
    title: "Direct Telegram",
    desc: "One-tap contact via Telegram. No phone numbers, just your @username.",
  },
  {
    icon: "check",
    title: "Verified Reviews",
    desc: "One rating per swap. Honest, actionable feedback you can trust.",
  },
  {
    icon: "filter",
    title: "Category Filters",
    desc: "Browse by type — channels, bots, games, TON, and more.",
  },
  {
    icon: "users",
    title: "Public Profiles",
    desc: "View any user's history and trust score before swapping.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, loading, isAuthenticated, isLoggedIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumCode, setPremiumCode] = useState("");
  const [premiumSaving, setPremiumSaving] = useState(false);
  const [premiumError, setPremiumError] = useState("");
  const [premiumSuccess, setPremiumSuccess] = useState(false);
  const redirected = useRef(false);
  const premiumRedirected = useRef(false);

  useEffect(() => {
    if (premiumSuccess && !premiumRedirected.current) {
      premiumRedirected.current = true;
      const t = setTimeout(() => window.location.href = "/explore", 1200);
      return () => clearTimeout(t);
    }
  }, [premiumSuccess]);

  useEffect(() => {
    if (redirected.current) return;
    if (isAuthenticated) { redirected.current = true; router.replace("/explore"); }
    else if (isLoggedIn && profile && !profile.has_onboarded) {
      redirected.current = true;
      router.replace("/onboarding");
    }
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
    <div className="min-h-screen bg-bg-dark">
      <nav className="flex items-center justify-between px-4 md:px-[141px] py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded overflow-hidden ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-semibold text-text tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Telefavor</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => router.push("/features")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Features</button>
          <button onClick={() => router.push("/community")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Community</button>
          <button onClick={() => router.push("/terms")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Terms</button>
        </div>
      </nav>

      <section className="px-4 md:px-[141px] pt-20 md:pt-28 pb-20" style={{ marginBottom: "250px" }}>
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 animate-fadeIn w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-[11px] font-medium mb-6">
              <Icon name="shield" size={12} />
              Trusted referral exchange network
            </div>
            <h1 className="text-[40px] md:text-[56px] font-light text-text leading-[1.05] mb-5 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Swap referrals<br />
              <span className="text-primary" style={{ fontWeight: 400 }}>with confidence</span>
            </h1>
            <p className="text-text-secondary text-[15px] max-w-md leading-relaxed mb-10">
              Telefavor connects you with real people for referral exchanges on Telegram.
              Post a listing, find a partner, build your reputation.
            </p>

            <div className="bg-bg-card border border-border rounded-xl p-5 max-w-sm">
              {error && <p className="text-red text-[12px] mb-3">{error}</p>}
              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="sr-only" />
                  <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${acceptedTerms ? "bg-primary border-primary" : "border-border bg-bg-inset group-hover:border-primary"}`}>
                    {acceptedTerms && <Icon name="check" size={10} className="text-white" />}
                  </div>
                </div>
                <span className="text-[12px] text-text-secondary leading-relaxed select-none">
                  I accept the{" "}
                  <button onClick={(e) => { e.stopPropagation(); router.push("/terms"); }} className="text-link hover:text-link-hover transition-colors">Terms of Service</button>
                </span>
              </label>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn || !acceptedTerms}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold flex items-center justify-center gap-2.5 disabled:opacity-40 transition-opacity hover:bg-primary-hover"
              >
                {signingIn ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </>
                )}
              </button>

              {!signingIn && (
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-[10px] text-text-muted bg-bg-card">or</span>
                  </div>
                </div>
              )}

              {!signingIn && (
                <button onClick={() => setPremiumOpen(true)} className="w-full py-2.5 rounded-lg border border-border text-text-secondary text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-bg-hover hover:text-text transition-colors">
                  <Icon name="star" size={14} />
                  Premium Access
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-bg-card border border-border rounded-2xl p-8 text-center max-w-[280px]">
              <div className="w-14 h-14 bg-primary-soft rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="star" size={24} className="text-primary" />
              </div>
              <p className="text-text text-[14px] font-medium">Trust Score</p>
              <p className="text-[28px] font-light text-green mt-1" style={{ fontFamily: "var(--font-heading)" }}>92%</p>
              <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-text-muted">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green" />12 green</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red" />1 red</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-[141px] py-20 border-y border-border" style={{ marginBottom: "250px" }}>
        <div className="text-center mb-12">
          <h2 className="text-[26px] font-light text-text" style={{ fontFamily: "var(--font-heading)" }}>Why Telefavor?</h2>
          <p className="text-text-secondary text-[14px] mt-3 max-w-lg mx-auto">Built for safe, transparent referral swapping on Telegram</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-xl p-5 animate-fadeIn">
              <div className="w-9 h-9 rounded-lg bg-bg-inset flex items-center justify-center mb-4">
                <Icon name={f.icon} size={16} className="text-primary" />
              </div>
              <h3 className="text-[14px] font-semibold text-text mb-2">{f.title}</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-4 md:px-[141px] py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <p className="text-center md:text-left">Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="hover:text-text-secondary transition-colors">Features</button>
            <button onClick={() => router.push("/community")} className="hover:text-text-secondary transition-colors">Community</button>
            <button onClick={() => router.push("/terms")} className="hover:text-text-secondary transition-colors">Terms</button>
          </div>
        </div>
      </footer>

      {premiumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={() => { setPremiumOpen(false); setPremiumCode(""); setPremiumError(""); setPremiumSuccess(false); }} />
          <div className="relative w-full max-w-sm bg-bg-dark border border-border rounded-xl p-6 animate-fadeIn">
            {premiumSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-4">
                  <Icon name="check" size={24} className="text-primary" />
                </div>
                <h2 className="text-[16px] font-semibold text-text mb-2" style={{ fontFamily: "var(--font-heading)" }}>Premium Access Granted!</h2>
                <p className="text-[12px] text-text-secondary leading-relaxed">Redirecting you to the app...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-bg-inset flex items-center justify-center flex-shrink-0">
                    <Icon name="star" size={18} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-text" style={{ fontFamily: "var(--font-heading)" }}>Premium Access</h2>
                    <p className="text-[11px] text-text-muted">Enter your 6-digit premium code</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={premiumCode}
                  onChange={(e) => setPremiumCode(e.target.value.replace((/\D/g), "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full bg-bg-inset text-text text-[22px] text-center tracking-[10px] rounded-lg px-4 py-3 outline-none border border-border focus:border-primary transition-colors font-mono placeholder:text-text-muted"
                  maxLength={6}
                  autoFocus
                />
                {premiumError && <p className="text-red text-[11px] mt-2 text-center">{premiumError}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setPremiumOpen(false); setPremiumCode(""); setPremiumError(""); }} className="flex-1 py-2.5 rounded-lg border border-border text-text-secondary text-[13px] font-medium hover:bg-bg-hover hover:text-text transition-colors">Cancel</button>
                  <button
                    onClick={async () => {
                      setPremiumSaving(true);
                      setPremiumError("");
                      try {
                        const res = await fetch("/api/premium/verify", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ code: premiumCode }),
                        });
                        const data = await res.json();
                        if (!res.ok || data.error) throw new Error(data.error || "Invalid code");
                        localStorage.setItem("premium_user_id", data.userId);
                        setPremiumSaving(false);
                        setPremiumSuccess(true);
                      } catch (err) {
                        setPremiumError(err.message);
                        setPremiumSaving(false);
                      }
                    }}
                    disabled={premiumSaving || premiumCode.length !== 6}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold disabled:opacity-40 transition-opacity hover:bg-primary-hover flex items-center justify-center gap-2"
                  >
                    {premiumSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Verify Code</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

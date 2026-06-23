"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoggedIn, profile } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumCode, setPremiumCode] = useState("");
  const [premiumSaving, setPremiumSaving] = useState(false);
  const [premiumError, setPremiumError] = useState("");
  const [premiumSuccess, setPremiumSuccess] = useState(false);
  const redirected = useRef(false);

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
    try { await signInWithGoogle(); }
    catch { setSigningIn(false); }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed left-0 right-0 top-0 z-50 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 md:h-20 flex items-center justify-between border-b border-border">
          <button onClick={() => router.push("/")} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
              <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Telefavor</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="text-[13px] text-text-secondary hover:text-text transition-colors">Features</button>
            <button onClick={() => router.push("/community")} className="text-[13px] text-text-secondary hover:text-text transition-colors">Community</button>
            <button onClick={() => router.push("/terms")} className="text-[13px] text-text-secondary hover:text-text transition-colors">Terms</button>
          </div>
        </div>
      </header>

      <div className="h-16 md:h-20" />

      <motion.section variants={container} initial="hidden" animate="show" className="relative overflow-hidden pt-16 md:pt-24 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-border px-4 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[12px] text-text-secondary tracking-wide">Introducing Telefavor</span>
            </motion.div>

            <motion.h1 variants={item} className="text-h0 mb-6">
              Swap referrals<br />
              <span className="text-accent">with confidence</span>
            </motion.h1>

            <motion.p variants={item} className="text-body mx-auto max-w-xl mb-10">
              Telefavor connects you with real people for referral exchanges on Telegram.
              Post a listing, find a partner, build your reputation.
            </motion.p>

            <motion.div variants={item} className="max-w-sm mx-auto">
              <div className="bg-bg-card border border-border rounded-2xl p-6">
                {signingIn ? (
                  <div className="flex justify-center py-4">
                    <div className="spinner" />
                  </div>
                ) : (
                  <>
                    <label className="flex items-start gap-3 cursor-pointer group mb-4">
                      <div className="relative mt-0.5 flex-shrink-0">
                        <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${acceptedTerms ? "bg-accent border-accent" : "border-border bg-bg group-hover:border-accent/50"}`}>
                          {acceptedTerms && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </div>
                      </div>
                      <span className="text-[12px] text-text-secondary leading-relaxed select-none">
                        I accept the{" "}
                        <button onClick={(e) => { e.stopPropagation(); router.push("/terms"); }} className="text-accent hover:text-accent-hover transition-colors">Terms of Service</button>
                      </span>
                    </label>

                    <button
                      onClick={handleGoogleSignIn}
                      disabled={!acceptedTerms}
                      className="w-full h-11 rounded-full bg-white text-black text-[13px] font-semibold disabled:opacity-30 transition-all duration-300 hover:bg-white/90 flex items-center justify-center gap-2.5"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Continue with Google
                    </button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center"><span className="px-2 text-[10px] text-text-muted bg-bg">or</span></div>
                    </div>

                    <button onClick={() => setPremiumOpen(true)} className="w-full h-11 rounded-full border border-border text-text-secondary text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-bg-hover hover:text-text transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Premium Access
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-border px-4 py-1 mb-4">
              <span className="text-[12px] text-text-secondary">Why Telefavor</span>
            </div>
            <h2 className="text-h2">Built for safe, transparent referral swapping</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "24h Listings", desc: "Post one active listing at a time. Automatically expires after 24 hours." },
              { title: "Trust Scores", desc: "Every swap earns a rating. Build your reputation with a transparent trust score." },
              { title: "Direct Telegram", desc: "One-tap contact via Telegram. No phone numbers, just your @username." },
              { title: "Verified Reviews", desc: "One rating per swap. Honest, actionable feedback you can trust." },
              { title: "Category Filters", desc: "Browse by type — channels, bots, games, TON, and more." },
              { title: "Public Profiles", desc: "View any user's history and trust score before swapping." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-bg-card border border-border rounded-2xl p-6 hover:bg-bg-hover transition-colors"
              >
                <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
                <p className="text-body-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-border px-4 py-1 mb-4">
            <span className="text-[12px] text-text-secondary">Trust Score</span>
          </div>
          <h2 className="text-h2 mb-4">Your reputation, on the chain</h2>
          <p className="text-body mx-auto max-w-lg mb-10">
            Each successful swap builds your trust score. Green ratings boost you up, red ratings keep the community honest.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {[
              { label: "New", color: "#A0A0A0", desc: "< 3 ratings" },
              { label: "Low Trust", color: "#EF4444", desc: "≤ 40%" },
              { label: "Building", color: "#F59E0B", desc: "41–65%" },
              { label: "Trusted", color: "#22C55E", desc: "66–85%" },
              { label: "Top Rated", color: "#FF6B35", desc: "86%+ & 10+" },
            ].map((b, i) => (
              <div key={i} className="bg-bg-card border border-border rounded-2xl p-4">
                <div className="text-[18px] font-semibold mb-1" style={{ color: b.color }}>{b.label}</div>
                <p className="text-[11px] text-text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center">
          <h2 className="text-h2 mb-4">Ready to start swapping?</h2>
          <p className="text-body mx-auto max-w-md mb-8">
            Join Telefavor today and build your referral network with trusted partners.
          </p>
          <button onClick={() => router.push("/")} className="inline-flex h-11 items-center gap-2 rounded-full bg-white text-black px-6 text-[13px] font-semibold hover:bg-white/90 transition-all duration-300">
            Get Started
          </button>
        </div>
      </section>

      <PremiumModal
        open={premiumOpen}
        onClose={() => { setPremiumOpen(false); setPremiumCode(""); setPremiumError(""); setPremiumSuccess(false); }}
        premiumCode={premiumCode}
        setPremiumCode={setPremiumCode}
        premiumSaving={premiumSaving}
        premiumError={premiumError}
        premiumSuccess={premiumSuccess}
        onVerify={async () => {
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
            setTimeout(() => window.location.href = "/explore", 1200);
          } catch (err) {
            setPremiumError(err.message);
            setPremiumSaving(false);
          }
        }}
      />

      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-caption">Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="text-caption hover:text-text-secondary transition-colors">Features</button>
            <button onClick={() => router.push("/community")} className="text-caption hover:text-text-secondary transition-colors">Community</button>
            <button onClick={() => router.push("/terms")} className="text-caption hover:text-text-secondary transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PremiumModal({ open, onClose, premiumCode, setPremiumCode, premiumSaving, premiumError, premiumSuccess, onVerify }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-sm bg-bg border border-border rounded-2xl p-6">
        {premiumSuccess ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-[17px] font-semibold mb-2">Premium Access Granted!</h3>
            <p className="text-body-sm">Redirecting you to the app...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF6B35" stroke="#FF6B35" strokeWidth="1"/></svg>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold">Premium Access</h3>
                <p className="text-caption">Enter your 6-digit premium code</p>
              </div>
            </div>
            <input
              type="text"
              value={premiumCode}
              onChange={(e) => setPremiumCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full bg-bg-card text-text text-[24px] text-center tracking-[10px] rounded-xl px-4 py-4 outline-none border border-border focus:border-accent transition-colors font-mono placeholder:text-text-muted"
              maxLength={6}
              autoFocus
            />
            {premiumError && <p className="text-red text-[11px] mt-2 text-center">{premiumError}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 h-11 rounded-full border border-border text-text-secondary text-[13px] font-medium hover:bg-bg-hover hover:text-text transition-colors">Cancel</button>
              <button
                onClick={onVerify}
                disabled={premiumSaving || premiumCode.length !== 6}
                className="flex-1 h-11 rounded-full bg-accent text-white text-[13px] font-semibold disabled:opacity-30 transition-all hover:bg-accent-hover flex items-center justify-center gap-2"
              >
                {premiumSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify Code"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

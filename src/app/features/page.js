"use client";
import { useRouter } from "next/navigation";

export default function FeaturesPage() {
  const router = useRouter();

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Referral Exchange",
      desc: "Swap Telegram and TON referrals — channel subs, bot invites, game referrals, group joins, and more. Post what you need, help someone else, and grow together.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Trust Score System",
      desc: "Every user has a trust score based on successful swaps. Green ratings boost your score, red ratings protect the community.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Public Profiles",
      desc: "View anyone's trust history, ratings, and listing activity before you swap. Make informed decisions.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Verified Reviews",
      desc: "Each swap generates a verifiable review. One rating per listing ensures honest, actionable feedback.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Category Filters",
      desc: "Filter by type — Telegram Channel, Telegram Bot, Telegram Group, Telegram Mini App, TON, and more. Quickly find the listing that matches your need.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 12C21 13.2 20.5 14.2 19.7 15C18.9 15.8 17.9 16.3 16.7 16.3C14.3 16.3 12.3 14.3 12.3 11.9C12.3 9.5 14.3 7.5 16.7 7.5C17.9 7.5 18.9 8 19.7 8.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 7H11M3 12H8M3 17H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Telegram Integration",
      desc: "Direct Telegram contact with one tap. No phone numbers required — just your @username.",
    },
  ];

  const steps = [
    { num: "1", title: "Sign In", desc: "Sign in with your Google account to get started." },
    { num: "2", title: "Set Up Profile", desc: "Add your Telegram username so others can reach you." },
    { num: "3", title: "Post a Listing", desc: "Choose a category and describe the referral you're offering." },
    { num: "4", title: "Connect & Swap", desc: "Browse listings, tap Contact, and complete your referral exchange on Telegram." },
    { num: "5", title: "Rate & Build Trust", desc: "After each swap, rate your experience. Build your reputation over time." },
  ];

  const badgeLevels = [
    { label: "New", color: "#94A3B8", min: 0, desc: "Fewer than 3 ratings" },
    { label: "Low Trust", color: "#EF4444", min: 1, desc: "Score ≤ 40%" },
    { label: "Building", color: "#F59E0B", min: 40, desc: "Score 41–65%" },
    { label: "Trusted", color: "#22C55E", min: 65, desc: "Score 66–85%" },
    { label: "Top Rated", color: "#F6C000", min: 85, desc: "Score 86%+ & 10+ ratings" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0B1A] bg-grid">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <button onClick={() => router.push("/")} className="text-[#94A3B8] hover:text-white transition-colors text-[14px] mb-8 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Back
        </button>

        {/* Hero */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-6">
            <img src="/logo.jpeg" alt="Telefavor" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-[28px] md:text-[44px] font-bold text-white mb-4">
            Everything You Need for <span className="gradient-text">Safe Referral Swaps</span>
          </h1>
          <p className="text-[18px] text-[#94A3B8] max-w-2xl mx-auto">
            Telefavor connects you with people for referral exchanges on Telegram. 
            Build trust, earn ratings, and grow your network — all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <h2 className="text-[22px] font-bold text-white mb-8 text-center">Core Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass rounded-xl p-6 card-hover animate-slideUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-[16px] font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-[13px] text-[#94A3B8] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <h2 className="text-[22px] font-bold text-white mb-8 text-center">How It Works</h2>
        <div className="relative mb-20">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#06B6D4] to-transparent block" />
          <div className="space-y-0 max-w-2xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-6 items-start animate-slideUp pb-8 last:pb-0" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0 relative z-10">
                  {s.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-[17px] font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-[14px] text-[#94A3B8]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score Badges */}
        <h2 className="text-[22px] font-bold text-white mb-8 text-center">Trust Badge Levels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {badgeLevels.map((b, i) => (
            <div key={i} className="bg-[#151230] rounded-xl p-4 text-center border border-[#1E1B3A] animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="text-[24px] font-bold mb-1" style={{ color: b.color }}>{b.label}</div>
              <p className="text-[11px] text-[#94A3B8] leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center glass rounded-2xl p-12 animate-fadeIn">
          <h2 className="text-[22px] font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-[14px] text-[#94A3B8] mb-6 max-w-md mx-auto">
            Join Telefavor today and start building your referral network with trusted partners.
          </p>
          <button onClick={() => router.push("/")} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[15px] font-semibold active:scale-95 hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all duration-200">Get Started</button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-[12px] text-[#94A3B8] space-y-1">
          <p>Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button onClick={() => router.push("/terms")} className="hover:text-white transition-colors">Terms of Service</button>
            <span>·</span>
            <button onClick={() => router.push("/features")} className="hover:text-white transition-colors">Features</button>
            <span>·</span>
            <button onClick={() => router.push("/community")} className="hover:text-white transition-colors">Community</button>
          </div>
        </div>
      </div>
    </div>
  );
}

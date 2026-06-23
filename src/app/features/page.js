"use client";
import { useRouter } from "next/navigation";
import Icon from "../../components/Icon";

const features = [
  { icon: "refresh", title: "Referral Exchange", desc: "Swap Telegram and TON referrals — channel subs, bot invites, game referrals, group joins, and more." },
  { icon: "star", title: "Trust Score System", desc: "Every user has a trust score based on successful swaps. Green ratings boost your score, red ratings protect the community." },
  { icon: "users", title: "Public Profiles", desc: "View anyone's trust history, ratings, and listing activity before you swap." },
  { icon: "check", title: "Verified Reviews", desc: "Each swap generates a verifiable review. One rating per listing ensures honest, actionable feedback." },
  { icon: "filter", title: "Category Filters", desc: "Filter by type — Telegram Channel, Telegram Bot, Telegram Group, Telegram Mini App, TON, and more." },
  { icon: "send", title: "Telegram Integration", desc: "Direct Telegram contact with one tap. No phone numbers required — just your @username." },
];

const steps = [
  { num: "1", title: "Sign In", desc: "Sign in with your Google account to get started." },
  { num: "2", title: "Set Up Profile", desc: "Add your Telegram username so others can reach you." },
  { num: "3", title: "Post a Listing", desc: "Choose a category and describe the referral you're offering." },
  { num: "4", title: "Connect & Swap", desc: "Browse listings, tap Contact, and complete your referral exchange on Telegram." },
  { num: "5", title: "Rate & Build Trust", desc: "After each swap, rate your experience. Build your reputation over time." },
];

const badgeLevels = [
  { label: "New", color: "var(--text-muted)", min: 0, desc: "Fewer than 3 ratings" },
  { label: "Low Trust", color: "var(--red)", min: 1, desc: "Score ≤ 40%" },
  { label: "Building", color: "#F59E0B", min: 40, desc: "Score 41–65%" },
  { label: "Trusted", color: "var(--green)", min: 65, desc: "Score 66–85%" },
  { label: "Top Rated", color: "#F6C000", min: 85, desc: "Score 86%+ & 10+ ratings" },
];

export default function FeaturesPage() {
  const router = useRouter();

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
          <button onClick={() => router.push("/community")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Community</button>
          <button onClick={() => router.push("/terms")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Terms</button>
        </div>
      </nav>

      <section className="px-4 md:px-[141px] pt-20 md:pt-28" style={{ marginBottom: "250px" }}>
        <div className="text-center mb-16 animate-fadeIn">
          <div className="w-14 h-14 rounded overflow-hidden mx-auto mb-6 ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="Telefavor" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-[28px] md:text-[40px] font-light text-text mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Everything You Need for <span className="text-primary" style={{ fontWeight: 400 }}>Safe Referral Swaps</span>
          </h1>
          <p className="text-[14px] text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Telefavor connects you with people for referral exchanges on Telegram.
            Build trust, earn ratings, and grow your network — all in one place.
          </p>
        </div>

        <h2 className="text-[20px] font-light text-text mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-20">
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

        <h2 className="text-[20px] font-light text-text mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>How It Works</h2>
        <div className="relative mb-20 max-w-2xl mx-auto">
          <div className="absolute left-[21px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5 items-start animate-fadeIn pb-8 last:pb-0">
                <div className="w-[42px] h-[42px] rounded-full bg-bg-inset border border-border flex items-center justify-center text-text text-[14px] font-semibold flex-shrink-0 relative z-10">
                  {s.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-[15px] font-semibold text-text mb-1">{s.title}</h3>
                  <p className="text-[13px] text-text-secondary">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-[20px] font-light text-text mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>Trust Badge Levels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {badgeLevels.map((b, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-xl p-4 text-center animate-fadeIn">
              <div className="text-[20px] font-semibold mb-1" style={{ color: b.color, fontFamily: "var(--font-heading)" }}>{b.label}</div>
              <p className="text-[11px] text-text-muted leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-bg-card border border-border rounded-xl p-10 animate-fadeIn max-w-lg mx-auto">
          <h2 className="text-[20px] font-light text-text mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to get started?</h2>
          <p className="text-[13px] text-text-secondary mb-6 max-w-sm mx-auto leading-relaxed">
            Join Telefavor today and start building your referral network with trusted partners.
          </p>
          <button onClick={() => router.push("/")} className="px-6 py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors">
            Get Started
          </button>
        </div>
      </section>

      <footer className="px-4 md:px-[141px] py-6 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <p>Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/community")} className="hover:text-text-secondary transition-colors">Community</button>
            <button onClick={() => router.push("/terms")} className="hover:text-text-secondary transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

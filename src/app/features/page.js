"use client";
import { useRouter } from "next/navigation";
import Icon from "../../components/Icon";

const features = [
  { icon: "refresh", title: "Referral Exchange", desc: "Swap Telegram and TON referrals — channel subs, bot invites, game referrals, group joins, and more. Post what you need, help someone else, and grow together." },
  { icon: "star", title: "Trust Score System", desc: "Every user has a trust score based on successful swaps. Green ratings boost your score, red ratings protect the community." },
  { icon: "users", title: "Public Profiles", desc: "View anyone's trust history, ratings, and listing activity before you swap. Make informed decisions." },
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
    <div className="min-h-screen bg-bg-dark bg-grid">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[17px] font-bold text-text">Telefavor</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => router.push("/community")} className="px-3 py-1.5 rounded-lg text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all">Community</button>
          <button onClick={() => router.push("/terms")} className="px-3 py-1.5 rounded-lg text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all">Terms</button>
        </div>
      </nav>

      <section className="px-4 md:px-8 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-6 ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="Telefavor" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-[28px] md:text-[44px] font-bold text-text mb-4">
            Everything You Need for <span className="text-primary">Safe Referral Swaps</span>
          </h1>
          <p className="text-[16px] text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Telefavor connects you with people for referral exchanges on Telegram.
            Build trust, earn ratings, and grow your network — all in one place.
          </p>
        </div>

        <h2 className="text-[22px] font-bold text-text mb-8 text-center">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {features.map((f, i) => (
            <div key={i} className="bg-bg-card rounded-xl border border-border p-5 card-hover animate-slideUp" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center mb-4">
                <Icon name={f.icon} size={18} className="text-primary" />
              </div>
              <h3 className="text-[15px] font-semibold text-text mb-2">{f.title}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[22px] font-bold text-text mb-8 text-center">How It Works</h2>
        <div className="relative mb-20 max-w-2xl mx-auto">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-primary to-transparent" />
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-6 items-start animate-slideUp pb-8 last:pb-0" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0 relative z-10 shadow-lg shadow-primary-glow/20">
                  {s.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-[17px] font-semibold text-text mb-1">{s.title}</h3>
                  <p className="text-[14px] text-text-secondary">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-[22px] font-bold text-text mb-8 text-center">Trust Badge Levels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {badgeLevels.map((b, i) => (
            <div key={i} className="bg-bg-card rounded-xl p-4 text-center border border-border animate-slideUp" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="text-[22px] font-bold mb-1" style={{ color: b.color }}>{b.label}</div>
              <p className="text-[11px] text-text-muted leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-bg-card rounded-2xl border border-border p-10 animate-fadeIn">
          <h2 className="text-[22px] font-bold text-text mb-3">Ready to get started?</h2>
          <p className="text-[14px] text-text-secondary mb-6 max-w-md mx-auto leading-relaxed">
            Join Telefavor today and start building your referral network with trusted partners.
          </p>
          <button onClick={() => router.push("/")} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-semibold active:scale-[0.97] hover:shadow-lg hover:shadow-primary-glow/30 transition-all duration-200">
            Get Started
          </button>
        </div>
      </section>

      <footer className="border-t border-border px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-text-muted">
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

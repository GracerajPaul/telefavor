"use client";
import { useRouter } from "next/navigation";
import Icon from "../../components/Icon";

export default function CommunityPage() {
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
          <button onClick={() => router.push("/features")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Features</button>
          <button onClick={() => router.push("/terms")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Terms</button>
        </div>
      </nav>

      <section className="px-4 md:px-[141px] pt-20 md:pt-28 text-center animate-fadeIn" style={{ marginBottom: "250px" }}>
        <div className="w-14 h-14 rounded-xl bg-primary-soft flex items-center justify-center mx-auto mb-6">
          <Icon name="users" size={24} className="text-primary" />
        </div>
        <h1 className="text-[28px] md:text-[36px] font-light text-text mb-3" style={{ fontFamily: "var(--font-heading)" }}>Community</h1>
        <p className="text-text-secondary text-[14px] mb-12 max-w-md mx-auto">Stay connected with the Telefavor community</p>

        <div className="bg-bg-card border border-border rounded-xl p-8 md:p-10 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-primary-soft flex items-center justify-center">
              <Icon name="send" size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-[18px] font-semibold text-text mb-2" style={{ fontFamily: "var(--font-heading)" }}>Join our Telegram Channel</h2>
              <p className="text-[13px] text-text-secondary leading-relaxed max-w-sm mx-auto">
                Stay up to date with the latest features, updates, and community announcements.
              </p>
              <a
                href="https://t.me/telefavor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors"
              >
                <Icon name="send" size={14} />
                Join Telegram Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-4 md:px-[141px] py-6 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <p>Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="hover:text-text-secondary transition-colors">Features</button>
            <button onClick={() => router.push("/terms")} className="hover:text-text-secondary transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

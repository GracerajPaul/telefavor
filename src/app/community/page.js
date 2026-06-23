"use client";
import { useRouter } from "next/navigation";
import Icon from "../../components/Icon";

export default function CommunityPage() {
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
          <button onClick={() => router.push("/features")} className="px-3 py-1.5 rounded-lg text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all">Features</button>
          <button onClick={() => router.push("/terms")} className="px-3 py-1.5 rounded-lg text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all">Terms</button>
        </div>
      </nav>

      <section className="px-4 md:px-8 py-16 md:py-24 max-w-4xl mx-auto animate-fadeIn text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-glow/20">
          <Icon name="users" size={28} className="text-white" />
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-text mb-4">Community</h1>
        <p className="text-text-secondary text-[15px] mb-12">Stay connected with the Telefavor community</p>

        <div className="bg-bg-card rounded-2xl border border-border p-6 md:p-10 animate-slideUp max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="send" size={32} className="text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-text mb-2">Join our Telegram Channel</h2>
              <p className="text-[14px] text-text-secondary leading-relaxed max-w-md mx-auto">
                Stay up to date with the latest features, updates, and community announcements.
                Get notified about new listings, platform improvements, and more.
              </p>
              <a
                href="https://t.me/telefavor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-semibold active:scale-[0.97] hover:shadow-lg hover:shadow-primary-glow/30 transition-all duration-200"
              >
                <Icon name="send" size={16} />
                Join Telegram Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-text-muted">
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

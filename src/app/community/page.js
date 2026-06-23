"use client";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed left-0 right-0 top-0 z-50 bg-bg/90 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded overflow-hidden border border-border">
              <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Telefavor</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => router.push("/features")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Features</button>
            <button onClick={() => router.push("/terms")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Terms</button>
          </div>
        </div>
      </header>

      <div className="h-16" />

      <section className="max-w-5xl mx-auto px-4 pt-20 md:pt-28 text-center">
        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-6 border border-accent/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1" /><circle cx="9" cy="7" r="4" /><path d="M23 20v-1a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
        </div>
        <h1 className="text-h2 text-text mb-3">Community</h1>
        <p className="text-body mb-12 max-w-md mx-auto">Stay connected with the Telefavor community</p>

        <div className="bg-bg-card border border-border rounded-xl p-8 md:p-10 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </div>
            <div className="text-center">
              <h2 className="text-[18px] font-semibold text-text mb-2">Join our Telegram Channel</h2>
              <p className="text-[13px] text-text-secondary leading-relaxed max-w-sm mx-auto">
                Stay up to date with the latest features, updates, and community announcements.
              </p>
              <a href="https://t.me/telefavor" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                Join Telegram Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-32 px-4 py-6 max-w-5xl mx-auto">
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

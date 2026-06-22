"use client";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0D0B1A] bg-grid">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <button onClick={() => router.push("/")} className="text-[#94A3B8] hover:text-white transition-colors text-[14px] mb-8 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Back
        </button>

        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-[28px] md:text-[36px] font-bold text-white mb-4">
            Community
          </h1>
          <p className="text-[#94A3B8] text-[14px]">Stay connected with the Telefavor community</p>
        </div>

        <div className="glass rounded-2xl p-4 md:p-10 animate-slideUp mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C9.38924 20 6.68673 18.1871 5.26782 15.5M3 12.5C3 7.80558 6.80558 4 11.5 4C14.6108 4 17.3133 5.81288 18.7322 8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 6V10H18M2 18V14H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-[22px] font-bold text-white mb-2">Join our Telegram Channel</h2>
              <p className="text-[14px] text-[#94A3B8] leading-relaxed max-w-lg">
                Stay up to date with the latest features, updates, and community announcements. 
                Get notified about new listings, platform improvements, and more.
              </p>
              <a
                href="https://t.me/telefavor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[15px] font-semibold active:scale-95 hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C9.38924 20 6.68673 18.1871 5.26782 15.5M3 12.5C3 7.80558 6.80558 4 11.5 4C14.6108 4 17.3133 5.81288 18.7322 8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 6V10H18M2 18V14H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Join Telegram Channel
              </a>
            </div>
          </div>
        </div>

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

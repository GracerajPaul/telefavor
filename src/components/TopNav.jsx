"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { key: "explore", label: "Explore", path: "/explore" },
  { key: "post", label: "Post", path: "/post" },
  { key: "profile", label: "Profile", path: "/profile" },
];

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex fixed top-0 left-0 right-0 bg-[#0D0B1A]/80 backdrop-blur-xl border-b border-[#1E1B3A] z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4 md:px-8 h-14">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Telefavor" className="w-7 h-7 md:w-8 md:h-8 rounded-lg object-cover" />
          <span className="text-[16px] md:text-[17px] font-bold text-white">Telefavor</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.path;
            return (
              <button
                key={tab.key}
                onClick={() => router.push(tab.path)}
                className={`relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#151230]"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] rounded-lg opacity-20" />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop secondary nav */}
        <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-[#1E1B3A]">
          <button onClick={() => router.push("/features")} className="text-[12px] text-[#94A3B8] hover:text-white transition-colors">Features</button>
          <span className="text-[#1E1B3A]">|</span>
          <button onClick={() => router.push("/terms")} className="text-[12px] text-[#94A3B8] hover:text-white transition-colors">Terms</button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151230] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 top-14 z-40 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-14 left-0 right-0 z-50 bg-[#151230] border-b border-[#1E1B3A] px-4 py-3 animate-slideDown">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const active = pathname === tab.path;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { router.push(tab.path); setMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${
                      active ? "bg-[#06B6D4]/20 text-[#06B6D4]" : "text-[#94A3B8] hover:text-white hover:bg-[#0D0B1A]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-[#1E1B3A] mt-3 pt-3 flex gap-4 px-4">
              <button onClick={() => { router.push("/features"); setMenuOpen(false); }} className="text-[13px] text-[#94A3B8] hover:text-white transition-colors">Features</button>
              <button onClick={() => { router.push("/terms"); setMenuOpen(false); }} className="text-[13px] text-[#94A3B8] hover:text-white transition-colors">Terms</button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

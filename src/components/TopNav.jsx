"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const links = [
  { href: "/explore", label: "Explore", icon: "search" },
  { href: "/post", label: "Post", icon: "plus" },
  { href: "/profile", label: "Profile", icon: "user" },
];

const secondaryLinks = [
  { href: "/features", label: "Features" },
  { href: "/community", label: "Community" },
  { href: "/terms", label: "Terms" },
];

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => router.push("/explore")} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[16px] font-semibold hidden sm:block tracking-tight">Telefavor</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <button key={l.href} onClick={() => router.push(l.href)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${isActive ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-bg-hover hover:text-text"}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {l.icon === "search" && <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.35-4.35" /></>}
                      {l.icon === "plus" && <><path d="M12 5v14" /><path d="M5 12h14" /></>}
                      {l.icon === "user" && <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" /></>}
                    </svg>
                    {l.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-0.5">
              {secondaryLinks.map((l) => (
                <button key={l.href} onClick={() => router.push(l.href)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
                  {l.label}
                </button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg-hover transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></> : <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="md:hidden fixed top-14 left-0 right-0 z-50 bg-bg border-b border-border">
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <button key={l.href} onClick={() => { router.push(l.href); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${isActive ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-bg-hover"}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {l.icon === "search" && <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.35-4.35" /></>}
                      {l.icon === "plus" && <><path d="M12 5v14" /><path d="M5 12h14" /></>}
                      {l.icon === "user" && <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" /></>}
                    </svg>
                    {l.label}
                  </button>
                );
              })}
              <div className="my-3 border-t border-border" />
              {secondaryLinks.map((l) => (
                <button key={l.href} onClick={() => { router.push(l.href); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

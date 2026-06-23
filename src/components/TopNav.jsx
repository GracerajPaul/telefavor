"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Icon from "./Icon";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <button onClick={() => router.push("/explore")} className="flex items-center gap-2.5 active:scale-95 transition-transform">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
              <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-[17px] font-bold text-text hidden sm:block">Telefavor</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <button
                  key={l.href}
                  onClick={() => router.push(l.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-text-secondary hover:text-text hover:bg-bg-elevated"
                  }`}
                >
                  <Icon name={l.icon} size={16} />
                  {l.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-1">
            {secondaryLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => router.push(l.href)}
                className="px-3 py-1.5 rounded-lg text-[13px] text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all duration-200"
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-bg-elevated transition-all active:scale-90"
          >
            <Icon name={menuOpen ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg-dark animate-slideDown">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <button
                  key={l.href}
                  onClick={() => { router.push(l.href); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-text-secondary hover:text-text hover:bg-bg-elevated"
                  }`}
                >
                  <Icon name={l.icon} size={18} />
                  {l.label}
                </button>
              );
            })}
            <div className="h-px bg-border my-2" />
            {secondaryLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => { router.push(l.href); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-[14px] text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

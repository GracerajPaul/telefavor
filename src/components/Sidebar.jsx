"use client";
import { useRouter, usePathname } from "next/navigation";

const primaryNav = [
  { href: "/explore", label: "Explore", icon: "search" },
  { href: "/post", label: "Post Listing", icon: "plus" },
  { href: "/profile", label: "My Profile", icon: "user" },
  { href: "/community", label: "Community", icon: "users" },
];

const secondaryNav = [
  { href: "/features", label: "Features" },
  { href: "/terms", label: "Terms" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-0 z-40 bg-bg border-r border-border">
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => router.push("/explore")} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-border">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Telefavor</span>
        </button>
      </div>

      <div className="mx-4 border-t border-border" />

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {primaryNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button key={item.href} onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-bg-hover hover:text-text"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {item.icon === "search" && <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.35-4.35" /></>}
                {item.icon === "plus" && <><path d="M12 5v14" /><path d="M5 12h14" /></>}
                {item.icon === "user" && <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" /></>}
                {item.icon === "users" && <><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1" /><circle cx="9" cy="7" r="4" /><path d="M23 20v-1a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>}
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-border mx-4">
        {secondaryNav.map((item) => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className="w-full flex items-center px-3 py-2 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
            {item.label}
          </button>
        ))}
        <div className="mx-2 mt-4 px-3 py-2 rounded-lg bg-bg-card border border-border">
          <p className="text-[10px] text-text-muted">Telefavor</p>
          <p className="text-[11px] font-medium mt-0.5 text-accent">Safe Referral Swaps</p>
        </div>
      </div>
    </aside>
  );
}

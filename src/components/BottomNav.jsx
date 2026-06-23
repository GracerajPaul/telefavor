"use client";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { href: "/explore", label: "Explore", icon: "search" },
  { href: "/post", label: "Post", icon: "plus" },
  { href: "/profile", label: "Profile", icon: "user" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((t) => {
          const isActive = pathname === t.href;
          return (
            <button
              key={t.href}
              onClick={() => router.push(t.href)}
              className={`flex flex-col items-center justify-center gap-0.5 px-5 py-1 relative transition-colors ${isActive ? "text-accent" : "text-text-muted"}`}
            >
              {isActive && <span className="absolute -top-px left-1/2 -translate-x-1/2 w-7 h-0.5 bg-accent rounded-b" />}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {t.icon === "search" && <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.35-4.35" /></>}
                {t.icon === "plus" && <><path d="M12 5v14" /><path d="M5 12h14" /></>}
                {t.icon === "user" && <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" /></>}
              </svg>
              <span className="text-[9px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

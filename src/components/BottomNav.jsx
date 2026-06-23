"use client";
import { useRouter, usePathname } from "next/navigation";
import Icon from "./Icon";

const tabs = [
  { href: "/explore", label: "Explore", icon: "search" },
  { href: "/post", label: "Post", icon: "plus" },
  { href: "/profile", label: "Profile", icon: "user" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-dark/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((t) => {
          const isActive = pathname === t.href;
          return (
            <button
              key={t.href}
              onClick={() => router.push(t.href)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl min-w-[64px] transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform`}>
                <Icon name={t.icon} size={20} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "opacity-100" : "opacity-70"}`}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

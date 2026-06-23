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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-dark border-t border-border">
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map((t) => {
          const isActive = pathname === t.href;
          return (
            <button
              key={t.href}
              onClick={() => router.push(t.href)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 min-w-[56px] transition-colors ${
                isActive ? "text-primary" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon name={t.icon} size={18} />
              <span className="text-[9px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

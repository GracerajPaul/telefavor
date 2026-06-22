"use client";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  {
    key: "explore",
    label: "Explore",
    path: "/explore",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    key: "post",
    label: "Post",
    path: "/post",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    key: "profile",
    label: "Profile",
    path: "/profile",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D0B1A]/95 backdrop-blur-xl border-t border-[#1E1B3A] z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-[64px] ${
                active ? "text-[#06B6D4]" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#06B6D4] rounded-full" />
              )}
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

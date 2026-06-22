"use client";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  {
    key: "explore",
    label: "Explore",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#06B6D4" : "#94A3B8"} strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" fill={active ? "#06B6D4" : "none"} stroke={active ? "#06B6D4" : "#94A3B8"} strokeWidth="2"/>
      </svg>
    ),
    path: "/explore",
  },
  {
    key: "post",
    label: "Post",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke={active ? "#06B6D4" : "#94A3B8"} strokeWidth="2"/>
        <path d="M12 8V16M8 12H16" stroke={active ? "#06B6D4" : "#94A3B8"} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    path: "/post",
  },
  {
    key: "profile",
    label: "Profile",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#06B6D4" : "#94A3B8"} strokeWidth="2"/>
        <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke={active ? "#06B6D4" : "#94A3B8"} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    path: "/profile",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0D0B1A] border-t border-[#1E1B3A] z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
            const active = pathname === tab.path;
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              className="ripple flex flex-col items-center gap-1 px-6 py-1 min-w-0"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {tab.icon(active)}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-[#06B6D4]" : "text-[#94A3B8]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

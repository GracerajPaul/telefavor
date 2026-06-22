"use client";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { key: "explore", label: "Explore", path: "/explore" },
  { key: "post", label: "Post", path: "/post" },
  { key: "profile", label: "Profile", path: "/profile" },
];

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="flex fixed top-0 left-0 right-0 bg-[#0D0B1A]/80 backdrop-blur-xl border-b border-[#1E1B3A] z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-8 h-14">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Telefavor" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-[17px] font-bold text-white">Telefavor</span>
        </div>
        <div className="flex items-center gap-1">
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
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[#1E1B3A]">
          <button onClick={() => router.push("/features")} className="text-[12px] text-[#94A3B8] hover:text-white transition-colors">Features</button>
          <span className="text-[#1E1B3A]">|</span>
          <button onClick={() => router.push("/terms")} className="text-[12px] text-[#94A3B8] hover:text-white transition-colors">Terms</button>
        </div>
      </div>
    </nav>
  );
}

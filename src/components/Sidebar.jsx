"use client";
import { useRouter, usePathname } from "next/navigation";
import Icon from "./Icon";

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
    <aside className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-0 bg-bg-dark border-r border-border z-40">
      <div className="px-4 pt-5 pb-4">
        <button onClick={() => router.push("/explore")} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded overflow-hidden ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-text" style={{ fontFamily: "var(--font-heading)" }}>Telefavor</span>
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {primaryNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pt-2 pb-2 border-t border-border mt-auto">
        {secondaryNav.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="w-full flex items-center px-3 py-2 rounded-lg text-[12px] text-text-muted hover:bg-bg-hover hover:text-text-secondary transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

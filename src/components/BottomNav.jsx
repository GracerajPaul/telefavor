\"use client\";
import { useRouter, usePathname } from \"next/navigation\";
import Icon from \"./Icon\";

const tabs = [
  { href: \"/explore\", label: \"Explore\", icon: \"search\" },
  { href: \"/post\", label: \"Post\", icon: \"plus\" },
  { href: \"/profile\", label: \"Profile\", icon: \"user\" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className=\"md:hidden fixed bottom-0 left-0 right-0 z-50\"
      style={{
        background: 'rgba(8,11,20,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className=\"flex items-center justify-around h-16 px-2\">
        {tabs.map((t) => {
          const isActive = pathname === t.href;
          return (
            <button
              key={t.href}
              onClick={() => router.push(t.href)}
              className=\"flex flex-col items-center justify-center gap-1 px-5 py-1 relative\"
              style={{
                color: isActive ? '#7eb5ff' : 'var(--color-text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Active pill indicator */}
              {isActive && (
                <span
                  className=\"absolute top-0 left-1/2\"
                  style={{
                    transform: 'translateX(-50%)',
                    width: '28px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #5b8def, #9b73f0)',
                    borderRadius: '0 0 3px 3px',
                    boxShadow: '0 0 8px rgba(91,141,239,0.6)',
                  }}
                />
              )}
              <span
                className=\"w-8 h-8 rounded-xl flex items-center justify-center\"
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(91,141,239,0.18), rgba(155,115,240,0.12))' : 'transparent',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon name={t.icon} size={17} />
              </span>
              <span className=\"text-[10px] font-medium\">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

\"use client\";
import { useRouter, usePathname } from \"next/navigation\";
import Icon from \"./Icon\";

const primaryNav = [
  { href: \"/explore\", label: \"Explore\", icon: \"search\" },
  { href: \"/post\", label: \"Post Listing\", icon: \"plus\" },
  { href: \"/profile\", label: \"My Profile\", icon: \"user\" },
  { href: \"/community\", label: \"Community\", icon: \"users\" },
];

const secondaryNav = [
  { href: \"/features\", label: \"Features\" },
  { href: \"/terms\", label: \"Terms\" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className=\"hidden md:flex flex-col w-[240px] h-screen fixed left-0 top-0 z-40\" style={{ background: 'rgba(8,11,20,0.92)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className=\"px-5 pt-6 pb-5\">
        <button
          onClick={() => router.push(\"/explore\")}
          className=\"flex items-center gap-3 group\"
        >
          <div className=\"w-8 h-8 rounded-lg overflow-hidden flex-shrink-0\" style={{ boxShadow: '0 0 12px rgba(91,141,239,0.3)' }}>
            <img src=\"/logo.jpeg\" alt=\"\" className=\"w-full h-full object-cover\" />
          </div>
          <div className=\"flex flex-col\">
            <span className=\"text-[15px] font-bold tracking-tight\" style={{ background: 'linear-gradient(135deg, #7eb5ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Telefavor
            </span>
            <span className=\"text-[10px]\" style={{ color: 'var(--color-text-muted)' }}>Referral Exchange</span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className=\"section-divider mx-4 mb-4\" />

      {/* Primary Nav */}
      <nav className=\"flex-1 px-3 space-y-0.5\">
        <p className=\"text-[10px] font-semibold uppercase tracking-wider px-3 mb-2\" style={{ color: 'var(--color-text-muted)' }}>Navigation</p>
        {primaryNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + \"/\");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive ? \"nav-item-active\" : \"\"
              }`}
              style={isActive ? {} : {
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(91,141,239,0.06)'; e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.transform = 'translateX(2px)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.transform = ''; }}}
            >
              <span className=\"w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0\" style={{ background: isActive ? 'rgba(91,141,239,0.15)' : 'rgba(255,255,255,0.04)' }}>
                <Icon name={item.icon} size={14} />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className=\"px-3 pt-3 pb-5\" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className=\"text-[10px] font-semibold uppercase tracking-wider px-3 mb-2\" style={{ color: 'var(--color-text-muted)' }}>More</p>
        {secondaryNav.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className=\"w-full flex items-center px-3 py-2 rounded-xl text-[12px] transition-all duration-200\"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,141,239,0.06)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            {item.label}
          </button>
        ))}

        {/* Powered by badge */}
        <div className=\"mt-4 mx-2 px-3 py-2 rounded-lg\" style={{ background: 'rgba(91,141,239,0.06)', border: '1px solid rgba(91,141,239,0.1)' }}>
          <p className=\"text-[10px]\" style={{ color: 'var(--color-text-muted)' }}>Built on Telegram</p>
          <p className=\"text-[11px] font-medium mt-0.5\" style={{ color: 'var(--color-primary)' }}>Secure • Trusted</p>
        </div>
      </div>
    </aside>
  );
}

\"use client\";
import { useState } from \"react\";
import { useRouter, usePathname } from \"next/navigation\";
import Icon from \"./Icon\";

const links = [
  { href: \"/explore\", label: \"Explore\", icon: \"search\" },
  { href: \"/post\", label: \"Post\", icon: \"plus\" },
  { href: \"/profile\", label: \"Profile\", icon: \"user\" },
];

const secondaryLinks = [
  { href: \"/features\", label: \"Features\" },
  { href: \"/community\", label: \"Community\" },
  { href: \"/terms\", label: \"Terms\" },
];

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className=\"fixed top-0 left-0 right-0 z-50\"
        style={{
          background: 'rgba(8, 11, 20, 0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className=\"max-w-7xl mx-auto px-4 md:px-8\">
          <div className=\"flex items-center justify-between h-14\">
            {/* Logo */}
            <button
              onClick={() => router.push(\"/explore\")}
              className=\"flex items-center gap-2.5\"
              style={{ transition: 'opacity 0.2s' }}
            >
              <div className=\"w-7 h-7 rounded-lg overflow-hidden flex-shrink-0\" style={{ boxShadow: '0 0 10px rgba(91,141,239,0.25)' }}>
                <img src=\"/logo.jpeg\" alt=\"\" className=\"w-full h-full object-cover\" />
              </div>
              <span
                className=\"text-[16px] font-bold hidden sm:block\"
                style={{ background: 'linear-gradient(135deg, #7eb5ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Telefavor
              </span>
            </button>

            {/* Desktop Nav */}
            <div className=\"hidden md:flex items-center gap-1\">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <button
                    key={l.href}
                    onClick={() => router.push(l.href)}
                    className=\"flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200\"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, rgba(91,141,239,0.15), rgba(155,115,240,0.1))' : 'transparent',
                      color: isActive ? '#7eb5ff' : 'var(--color-text-secondary)',
                      border: isActive ? '1px solid rgba(91,141,239,0.25)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--color-text)'; }}}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}}
                  >
                    <Icon name={l.icon} size={14} />
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop Secondary Links */}
            <div className=\"hidden md:flex items-center gap-0.5\">
              {secondaryLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => router.push(l.href)}
                  className=\"px-3 py-1.5 rounded-lg text-[12px] transition-all duration-200\"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className=\"md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all\"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Icon name={menuOpen ? \"x\" : \"menu\"} size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <>
          <div
            className=\"fixed inset-0 z-40 animate-fadeInFast\"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className=\"md:hidden fixed top-14 left-0 right-0 z-50 animate-slideDown\"
            style={{ background: 'rgba(8,11,20,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className=\"px-4 py-4 space-y-1\">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <button
                    key={l.href}
                    onClick={() => { router.push(l.href); setMenuOpen(false); }}
                    className=\"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all\"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, rgba(91,141,239,0.12), rgba(155,115,240,0.08))' : 'transparent',
                      color: isActive ? '#7eb5ff' : 'var(--color-text-secondary)',
                      border: isActive ? '1px solid rgba(91,141,239,0.2)' : '1px solid transparent',
                    }}
                  >
                    <span className=\"w-8 h-8 rounded-lg flex items-center justify-center\" style={{ background: isActive ? 'rgba(91,141,239,0.15)' : 'rgba(255,255,255,0.04)' }}>
                      <Icon name={l.icon} size={16} />
                    </span>
                    {l.label}
                  </button>
                );
              })}
              <div className=\"section-divider my-3\" />
              {secondaryLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => { router.push(l.href); setMenuOpen(false); }}
                  className=\"w-full text-left px-4 py-2.5 rounded-xl text-[13px] transition-all\"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

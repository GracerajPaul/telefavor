\"use client\";
import { useEffect, useState, useRef } from \"react\";
import { useRouter } from \"next/navigation\";
import { signInWithGoogle } from \"../services/auth\";
import { useAuth } from \"../context/AuthContext\";
import Icon from \"../components/Icon\";

const features = [
  {
    icon: \"clock\",
    title: \"24h Listings\",
    desc: \"Post one active listing at a time. Automatically expires after 24 hours.\",
    color: \"#5b8def\",
    gradient: \"linear-gradient(135deg, rgba(91,141,239,0.15), rgba(91,141,239,0.05))\",
  },
  {
    icon: \"star\",
    title: \"Trust Scores\",
    desc: \"Every swap earns a rating. Build your reputation with a transparent trust score.\",
    color: \"#f6c000\",
    gradient: \"linear-gradient(135deg, rgba(246,192,0,0.12), rgba(246,192,0,0.04))\",
  },
  {
    icon: \"send\",
    title: \"Direct Telegram\",
    desc: \"One-tap contact via Telegram. No phone numbers, just your @username.\",
    color: \"#22d3ee\",
    gradient: \"linear-gradient(135deg, rgba(34,211,238,0.12), rgba(34,211,238,0.04))\",
  },
  {
    icon: \"check\",
    title: \"Verified Reviews\",
    desc: \"One rating per swap. Honest, actionable feedback you can trust.\",
    color: \"#34d399\",
    gradient: \"linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.04))\",
  },
  {
    icon: \"filter\",
    title: \"Category Filters\",
    desc: \"Browse by type — channels, bots, games, TON, and more.\",
    color: \"#9b73f0\",
    gradient: \"linear-gradient(135deg, rgba(155,115,240,0.15), rgba(155,115,240,0.05))\",
  },
  {
    icon: \"users\",
    title: \"Public Profiles\",
    desc: \"View any user's history and trust score before swapping.\",
    color: \"#fb923c\",
    gradient: \"linear-gradient(135deg, rgba(251,146,60,0.12), rgba(251,146,60,0.04))\",
  },
];

const stats = [
  { value: \"24h\", label: \"Listing Lifetime\" },
  { value: \"100%\", label: \"Telegram Native\" },
  { value: \"0\", label: \"Phone Required\" },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, loading, isAuthenticated, isLoggedIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(\"\");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumCode, setPremiumCode] = useState(\"\");
  const [premiumSaving, setPremiumSaving] = useState(false);
  const [premiumError, setPremiumError] = useState(\"\");
  const [premiumSuccess, setPremiumSuccess] = useState(false);
  const redirected = useRef(false);
  const premiumRedirected = useRef(false);

  useEffect(() => {
    if (premiumSuccess && !premiumRedirected.current) {
      premiumRedirected.current = true;
      const t = setTimeout(() => window.location.href = \"/explore\", 1200);
      return () => clearTimeout(t);
    }
  }, [premiumSuccess]);

  useEffect(() => {
    if (redirected.current) return;
    if (isAuthenticated) { redirected.current = true; router.replace(\"/explore\"); }
    else if (isLoggedIn && profile && !profile.has_onboarded) {
      redirected.current = true;
      router.replace(\"/onboarding\");
    }
  }, [isAuthenticated, isLoggedIn, profile, router]);

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) return;
    setSigningIn(true);
    setError(\"\");
    try {
      await signInWithGoogle();
    } catch {
      setError(\"Failed to sign in. Please try again.\");
      setSigningIn(false);
    }
  };

  return (
    <div className=\"min-h-screen\" style={{ background: 'var(--color-bg-dark)' }}>

      {/* ── Navigation ──────────────────────────────── */}
      <nav
        className=\"fixed top-0 left-0 right-0 z-50\"
        style={{
          background: 'rgba(8,11,20,0.8)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className=\"max-w-7xl mx-auto px-5 md:px-12\">
          <div className=\"flex items-center justify-between h-14\">
            <div className=\"flex items-center gap-2.5\">
              <div className=\"w-7 h-7 rounded-lg overflow-hidden\" style={{ boxShadow: '0 0 10px rgba(91,141,239,0.3)' }}>
                <img src=\"/logo.jpeg\" alt=\"\" className=\"w-full h-full object-cover\" />
              </div>
              <span
                className=\"text-[15px] font-bold\"
                style={{ background: 'linear-gradient(135deg, #7eb5ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Telefavor
              </span>
            </div>
            <div className=\"flex items-center gap-1\">
              {[
                { label: 'Features', href: '/features' },
                { label: 'Community', href: '/community' },
                { label: 'Terms', href: '/terms' },
              ].map(l => (
                <button
                  key={l.href}
                  onClick={() => router.push(l.href)}
                  className=\"px-3 py-1.5 rounded-lg text-[12px] transition-all\"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color='var(--color-text-secondary)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='var(--color-text-muted)'; e.currentTarget.style.background='transparent'; }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────── */}
      <section className=\"relative overflow-hidden pt-28 pb-24 px-5 md:px-12\">
        {/* Background Orbs */}
        <div className=\"orb orb-1\" />
        <div className=\"orb orb-2\" />
        <div className=\"orb orb-3\" />

        {/* Grid overlay */}
        <div
          className=\"absolute inset-0 pointer-events-none\"
          style={{
            backgroundImage: 'linear-gradient(rgba(91,141,239,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(91,141,239,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className=\"relative max-w-7xl mx-auto\">
          <div className=\"flex flex-col lg:flex-row gap-16 items-center\">

            {/* Left: Copy */}
            <div className=\"flex-1 animate-slideUp\">
              {/* Badge */}
              <div
                className=\"inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7\"
                style={{
                  background: 'linear-gradient(135deg, rgba(91,141,239,0.12), rgba(155,115,240,0.08))',
                  border: '1px solid rgba(91,141,239,0.25)',
                  color: '#7eb5ff',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <Icon name=\"shield\" size={12} />
                Trusted Referral Exchange Network
                <span
                  className=\"w-1.5 h-1.5 rounded-full\"
                  style={{ background: '#34d399', boxShadow: '0 0 6px rgba(52,211,153,0.6)' }}
                />
              </div>

              {/* Headline */}
              <h1
                className=\"text-[44px] md:text-[62px] font-extrabold leading-[1.05] mb-6 tracking-tight\"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span style={{ color: 'var(--color-text)' }}>Swap referrals</span>
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #7eb5ff 0%, #a78bfa 50%, #22d3ee 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto',
                    animation: 'gradientShift 4s ease infinite',
                  }}
                >
                  with confidence
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className=\"text-[16px] max-w-md leading-relaxed mb-10\"
                style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
              >
                Telefavor connects you with real people for referral exchanges on Telegram.
                Post a listing, find a partner, build your reputation.
              </p>

              {/* Stats Row */}
              <div className=\"flex items-center gap-8 mb-10\">
                {stats.map((s, i) => (
                  <div key={i} className=\"text-center\">
                    <p
                      className=\"text-[24px] font-bold\"
                      style={{ background: 'linear-gradient(135deg, #5b8def, #9b73f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      {s.value}
                    </p>
                    <p className=\"text-[11px] mt-0.5\" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Sign-in Card */}
              <div
                className=\"max-w-sm p-5 rounded-2xl animate-scaleIn\"
                style={{
                  background: 'rgba(13,17,30,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(91,141,239,0.15)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(91,141,239,0.06)',
                }}
              >
                {error && (
                  <p className=\"text-[12px] mb-3 px-3 py-2 rounded-lg\" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    {error}
                  </p>
                )}

                {/* Terms Checkbox */}
                <label className=\"flex items-start gap-3 cursor-pointer group mb-5\">
                  <div className=\"relative mt-0.5 flex-shrink-0\">
                    <input
                      type=\"checkbox\"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className=\"sr-only\"
                    />
                    <div
                      className=\"w-4 h-4 rounded flex items-center justify-center transition-all\"
                      style={{
                        background: acceptedTerms ? 'linear-gradient(135deg, #5b8def, #9b73f0)' : 'rgba(8,12,24,0.6)',
                        border: acceptedTerms ? 'none' : '1px solid rgba(255,255,255,0.12)',
                        boxShadow: acceptedTerms ? '0 0 10px rgba(91,141,239,0.3)' : 'none',
                      }}
                    >
                      {acceptedTerms && <Icon name=\"check\" size={10} className=\"text-white\" />}
                    </div>
                  </div>
                  <span className=\"text-[12px] leading-relaxed select-none\" style={{ color: 'var(--color-text-secondary)' }}>
                    I accept the{\" \"}
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(\"/terms\"); }}
                      style={{ color: 'var(--color-link)', textDecoration: 'underline', textDecorationColor: 'rgba(126,181,255,0.3)' }}
                    >
                      Terms of Service
                    </button>
                  </span>
                </label>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={signingIn || !acceptedTerms}
                  className=\"w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2.5 transition-all\"
                  style={{
                    background: acceptedTerms ? 'linear-gradient(135deg, #5b8def, #7a6cf5)' : 'rgba(255,255,255,0.06)',
                    color: acceptedTerms ? '#fff' : 'var(--color-text-muted)',
                    opacity: signingIn ? 0.7 : 1,
                    boxShadow: acceptedTerms ? '0 4px 20px rgba(91,141,239,0.3)' : 'none',
                    border: acceptedTerms ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    cursor: !acceptedTerms ? 'not-allowed' : 'pointer',
                  }}
                >
                  {signingIn ? (
                    <div className=\"spinner-sm\" />
                  ) : (
                    <>
                      <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\">
                        <path fill=\"white\" d=\"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z\"/>
                        <path fill=\"white\" d=\"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z\"/>
                        <path fill=\"white\" d=\"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z\"/>
                        <path fill=\"white\" d=\"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z\"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                {!signingIn && (
                  <>
                    <div className=\"relative my-4 flex items-center\">
                      <div className=\"flex-1 section-divider\" />
                      <span className=\"px-3 text-[10px]\" style={{ color: 'var(--color-text-muted)' }}>or</span>
                      <div className=\"flex-1 section-divider\" />
                    </div>

                    <button
                      onClick={() => setPremiumOpen(true)}
                      className=\"w-full py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all\"
                      style={{
                        background: 'rgba(246,192,0,0.06)',
                        border: '1px solid rgba(246,192,0,0.18)',
                        color: '#fbbf24',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(246,192,0,0.1)'; e.currentTarget.style.boxShadow='0 0 16px rgba(246,192,0,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(246,192,0,0.06)'; e.currentTarget.style.boxShadow='none'; }}
                    >
                      <Icon name=\"star\" size={14} />
                      Premium Access
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right: Visual */}
            <div className=\"hidden lg:flex items-center justify-center flex-1\">
              <div className=\"relative\">
                {/* Glow behind */}
                <div
                  className=\"absolute inset-0 rounded-3xl\"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(91,141,239,0.15) 0%, transparent 70%)', filter: 'blur(30px)', transform: 'scale(1.2)' }}
                />

                {/* Main Trust Card */}
                <div
                  className=\"relative p-7 rounded-2xl text-center animate-scaleIn\"
                  style={{
                    background: 'rgba(13,17,30,0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(91,141,239,0.18)',
                    minWidth: '260px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,141,239,0.08)',
                  }}
                >
                  {/* Ring Visualization */}
                  <div className=\"relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-4\">
                    <svg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" className=\"absolute\">
                      <circle cx=\"40\" cy=\"40\" r=\"34\" fill=\"none\" stroke=\"rgba(91,141,239,0.12)\" strokeWidth=\"6\" />
                      <circle
                        cx=\"40\" cy=\"40\" r=\"34\" fill=\"none\"
                        stroke=\"url(#grad)\" strokeWidth=\"6\"
                        strokeDasharray=\"213.6\" strokeDashoffset=\"17\"
                        strokeLinecap=\"round\"
                        transform=\"rotate(-90 40 40)\"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(91,141,239,0.5))' }}
                      />
                      <defs>
                        <linearGradient id=\"grad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">
                          <stop offset=\"0%\" stopColor=\"#5b8def\" />
                          <stop offset=\"100%\" stopColor=\"#9b73f0\" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className=\"relative z-10 text-center\">
                      <p className=\"text-[18px] font-bold\" style={{ color: 'var(--color-text)' }}>92%</p>
                    </div>
                  </div>

                  <p className=\"text-[13px] font-semibold mb-1\" style={{ color: 'var(--color-text)' }}>Trust Score</p>
                  <p className=\"text-[11px] mb-4\" style={{ color: 'var(--color-text-muted)' }}>Based on swap history</p>

                  <div className=\"flex items-center justify-center gap-4 mb-4\">
                    <span className=\"flex items-center gap-1.5 text-[11px]\" style={{ color: '#34d399' }}>
                      <span className=\"w-2 h-2 rounded-full\" style={{ background: '#34d399', boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
                      12 green
                    </span>
                    <span className=\"flex items-center gap-1.5 text-[11px]\" style={{ color: '#f87171' }}>
                      <span className=\"w-2 h-2 rounded-full\" style={{ background: '#f87171', boxShadow: '0 0 6px rgba(248,113,113,0.5)' }} />
                      1 red
                    </span>
                  </div>

                  <div
                    className=\"px-3 py-1.5 rounded-full inline-flex items-center gap-1.5\"
                    style={{ background: 'rgba(246,192,0,0.1)', border: '1px solid rgba(246,192,0,0.2)' }}
                  >
                    <span className=\"text-[11px] font-semibold\" style={{ color: '#fbbf24' }}>⭐ Top Rated</span>
                  </div>
                </div>

                {/* Floating Mini Cards */}
                <div
                  className=\"absolute -top-4 -right-8 p-3 rounded-xl animate-fadeIn\"
                  style={{
                    background: 'rgba(13,17,30,0.9)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    animationDelay: '0.3s',
                  }}
                >
                  <div className=\"flex items-center gap-2\">
                    <span className=\"w-6 h-6 rounded-lg flex items-center justify-center\" style={{ background: 'rgba(52,211,153,0.15)' }}>
                      <Icon name=\"check\" size={12} style={{ color: '#34d399' }} />
                    </span>
                    <div>
                      <p className=\"text-[10px] font-medium\" style={{ color: 'var(--color-text)' }}>Swap Complete</p>
                      <p className=\"text-[9px]\" style={{ color: 'var(--color-text-muted)' }}>2 min ago</p>
                    </div>
                  </div>
                </div>

                <div
                  className=\"absolute -bottom-4 -left-8 p-3 rounded-xl animate-fadeIn\"
                  style={{
                    background: 'rgba(13,17,30,0.9)',
                    border: '1px solid rgba(91,141,239,0.2)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    animationDelay: '0.6s',
                  }}
                >
                  <div className=\"flex items-center gap-2\">
                    <span className=\"w-6 h-6 rounded-lg flex items-center justify-center\" style={{ background: 'rgba(91,141,239,0.15)' }}>
                      <Icon name=\"users\" size={12} style={{ color: '#5b8def' }} />
                    </span>
                    <div>
                      <p className=\"text-[10px] font-medium\" style={{ color: 'var(--color-text)' }}>+3 Partners</p>
                      <p className=\"text-[9px]\" style={{ color: 'var(--color-text-muted)' }}>This week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────── */}
      <section className=\"relative py-24 px-5 md:px-12\">
        <div className=\"section-divider mb-24\" />
        <div className=\"max-w-7xl mx-auto\">
          <div className=\"text-center mb-14\">
            <div
              className=\"inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5\"
              style={{
                background: 'rgba(155,115,240,0.08)',
                border: '1px solid rgba(155,115,240,0.2)',
                color: '#a78bfa',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <Icon name=\"star\" size={11} />
              Why Telefavor
            </div>
            <h2
              className=\"text-[32px] md:text-[40px] font-bold mb-4 tracking-tight\"
              style={{ color: 'var(--color-text)', fontFamily: 'Inter, sans-serif' }}
            >
              Built for trusted
              <br />
              <span style={{ background: 'linear-gradient(135deg, #5b8def, #9b73f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>referral swapping</span>
            </h2>
            <p className=\"text-[15px] max-w-lg mx-auto\" style={{ color: 'var(--color-text-secondary)' }}>
              Every feature is designed to make Telegram referral exchanges safe, transparent, and rewarding.
            </p>
          </div>

          <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4\">
            {features.map((f, i) => (
              <div
                key={i}
                className=\"p-5 rounded-2xl card-lift animate-fadeIn\"
                style={{
                  background: f.gradient,
                  border: `1px solid ${f.color}20`,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div
                  className=\"w-10 h-10 rounded-xl flex items-center justify-center mb-4\"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}25` }}
                >
                  <Icon name={f.icon} size={18} style={{ color: f.color }} />
                </div>
                <h3 className=\"text-[15px] font-semibold mb-2\" style={{ color: 'var(--color-text)' }}>
                  {f.title}
                </h3>
                <p className=\"text-[13px] leading-relaxed\" style={{ color: 'var(--color-text-secondary)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────── */}
      <section className=\"relative py-20 px-5 md:px-12\">
        <div className=\"section-divider mb-20\" />
        <div className=\"max-w-2xl mx-auto text-center\">
          <div
            className=\"p-10 rounded-3xl\"
            style={{
              background: 'linear-gradient(135deg, rgba(91,141,239,0.08) 0%, rgba(155,115,240,0.06) 50%, rgba(34,211,238,0.04) 100%)',
              border: '1px solid rgba(91,141,239,0.15)',
              boxShadow: '0 0 80px rgba(91,141,239,0.06)',
            }}
          >
            <div
              className=\"w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5\"
              style={{ background: 'linear-gradient(135deg, #5b8def, #9b73f0)', boxShadow: '0 0 30px rgba(91,141,239,0.4)' }}
            >
              <Icon name=\"send\" size={24} style={{ color: '#fff' }} />
            </div>
            <h2 className=\"text-[28px] font-bold mb-3\" style={{ color: 'var(--color-text)', fontFamily: 'Inter, sans-serif' }}>
              Ready to get started?
            </h2>
            <p className=\"text-[14px] mb-7\" style={{ color: 'var(--color-text-secondary)' }}>
              Join the community and start your first referral exchange today.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className=\"px-8 py-3 rounded-xl text-[14px] font-semibold text-white transition-all\"
              style={{
                background: 'linear-gradient(135deg, #5b8def, #9b73f0)',
                boxShadow: '0 4px 24px rgba(91,141,239,0.35)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(91,141,239,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(91,141,239,0.35)'; }}
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className=\"py-8 px-5 md:px-12\">
        <div className=\"section-divider mb-8\" />
        <div className=\"max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4\">
          <div className=\"flex items-center gap-2\">
            <div className=\"w-5 h-5 rounded overflow-hidden\">
              <img src=\"/logo.jpeg\" alt=\"\" className=\"w-full h-full object-cover\" />
            </div>
            <p className=\"text-[12px]\" style={{ color: 'var(--color-text-muted)' }}>
              Telefavor — Safe Referral Exchanges on Telegram
            </p>
          </div>
          <div className=\"flex items-center gap-5\">
            {[
              { label: 'Features', href: '/features' },
              { label: 'Community', href: '/community' },
              { label: 'Terms', href: '/terms' },
            ].map(l => (
              <button
                key={l.href}
                onClick={() => router.push(l.href)}
                className=\"text-[12px] transition-colors\"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color='var(--color-text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color='var(--color-text-muted)'}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Premium Modal ─────────────────────────────── */}
      {premiumOpen && (
        <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4\">
          <div
            className=\"absolute inset-0 animate-fadeInFast\"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setPremiumOpen(false); setPremiumCode(\"\"); setPremiumError(\"\"); setPremiumSuccess(false); }}
          />
          <div
            className=\"relative w-full max-w-sm rounded-2xl p-6 animate-scaleIn\"
            style={{
              background: 'rgba(13,17,30,0.97)',
              border: '1px solid rgba(91,141,239,0.2)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,141,239,0.08)',
            }}
          >
            {premiumSuccess ? (
              <div className=\"text-center py-6\">
                <div
                  className=\"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5\"
                  style={{ background: 'linear-gradient(135deg, rgba(91,141,239,0.2), rgba(155,115,240,0.15))', border: '1px solid rgba(91,141,239,0.3)' }}
                >
                  <Icon name=\"check\" size={28} style={{ color: '#5b8def' }} />
                </div>
                <h2 className=\"text-[18px] font-bold mb-2\" style={{ color: 'var(--color-text)' }}>Premium Access Granted!</h2>
                <p className=\"text-[13px]\" style={{ color: 'var(--color-text-secondary)' }}>Redirecting you to the app...</p>
              </div>
            ) : (
              <>
                <div className=\"flex items-center gap-3 mb-6\">
                  <div
                    className=\"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0\"
                    style={{ background: 'rgba(246,192,0,0.1)', border: '1px solid rgba(246,192,0,0.2)' }}
                  >
                    <Icon name=\"star\" size={18} style={{ color: '#fbbf24' }} />
                  </div>
                  <div>
                    <h2 className=\"text-[15px] font-bold\" style={{ color: 'var(--color-text)' }}>Premium Access</h2>
                    <p className=\"text-[11px]\" style={{ color: 'var(--color-text-muted)' }}>Enter your 6-digit premium code</p>
                  </div>
                </div>

                <input
                  type=\"text\"
                  value={premiumCode}
                  onChange={(e) => setPremiumCode(e.target.value.replace((/\\D/g), \"\").slice(0, 6))}
                  placeholder=\"000000\"
                  className=\"w-full text-[24px] text-center tracking-[12px] rounded-xl px-4 py-4 outline-none transition-all font-mono\"
                  style={{
                    background: 'rgba(8,12,24,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--color-text)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor='rgba(91,141,239,0.5)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(91,141,239,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow='none'; }}
                  maxLength={6}
                  autoFocus
                />

                {premiumError && (
                  <p className=\"text-[11px] mt-2 text-center px-3 py-1.5 rounded-lg\" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    {premiumError}
                  </p>
                )}

                <div className=\"flex gap-3 mt-5\">
                  <button
                    onClick={() => { setPremiumOpen(false); setPremiumCode(\"\"); setPremiumError(\"\"); }}
                    className=\"flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all\"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setPremiumSaving(true);
                      setPremiumError(\"\");
                      try {
                        const res = await fetch(\"/api/premium/verify\", {
                          method: \"POST\",
                          headers: { \"Content-Type\": \"application/json\" },
                          body: JSON.stringify({ code: premiumCode }),
                        });
                        const data = await res.json();
                        if (!res.ok || data.error) throw new Error(data.error || \"Invalid code\");
                        localStorage.setItem(\"premium_user_id\", data.userId);
                        setPremiumSaving(false);
                        setPremiumSuccess(true);
                      } catch (err) {
                        setPremiumError(err.message);
                        setPremiumSaving(false);
                      }
                    }}
                    disabled={premiumSaving || premiumCode.length !== 6}
                    className=\"flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all\"
                    style={{
                      background: premiumCode.length === 6 ? 'linear-gradient(135deg, #5b8def, #9b73f0)' : 'rgba(91,141,239,0.1)',
                      color: premiumCode.length === 6 ? '#fff' : 'var(--color-text-muted)',
                      opacity: premiumSaving ? 0.7 : 1,
                      cursor: premiumCode.length !== 6 ? 'not-allowed' : 'pointer',
                      boxShadow: premiumCode.length === 6 ? '0 4px 16px rgba(91,141,239,0.3)' : 'none',
                    }}
                  >
                    {premiumSaving ? <div className=\"spinner-sm\" /> : <span>Verify Code</span>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

\"use client\";
import { useState, useEffect, useRef, useCallback } from \"react\";
import { useRouter } from \"next/navigation\";
import { getActiveListings, getUser } from \"../../../services/database\";
import { useAuth } from \"../../../context/AuthContext\";
import { useToast } from \"../../../components/Toast\";
import ListingCard from \"../../../components/ListingCard\";
import CategoryChips from \"../../../components/CategoryChips\";
import { ListingSkeleton } from \"../../../components/Skeleton\";
import Icon from \"../../../components/Icon\";

export default function ExplorePage() {
  const router = useRouter();
  const { user: fbUser } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(\"\");
  const [category, setCategory] = useState(\"\");
  const [sort, setSort] = useState(\"newest\");
  const [refreshing, setRefreshing] = useState(false);
  const touchStart = useRef(0);
  const touchY = useRef(0);

  const fetchListings = useCallback(async () => {
    try {
      const data = await getActiveListings();
      const withUsers = await Promise.all(
        data.map(async (l) => {
          const u = await getUser(l.user_id);
          return { ...l, userData: u };
        })
      );
      setListings(withUsers.filter((l) => l.userData));
    } catch {
      toast(\"Failed to load listings\", \"error\");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; touchY.current = window.scrollY; };
  const handleTouchMove = (e) => {
    if (window.scrollY > 10) return;
    const diff = e.touches[0].clientY - touchStart.current;
    if (diff > 80 && !refreshing) { setRefreshing(true); fetchListings(); }
  };

  const filtered = listings
    .filter((l) => {
      if (category && !l.title.toLowerCase().includes(category.toLowerCase())) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = (l.userData?.display_name || \"\").toLowerCase();
        const user = (l.telegram_username || \"\").toLowerCase();
        const title = l.title.toLowerCase();
        if (!name.includes(q) && !user.includes(q) && !title.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => sort === \"newest\" ? new Date(b.posted_at) - new Date(a.posted_at) : (b.contact_taps || 0) - (a.contact_taps || 0));

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className=\"animate-fadeIn\">

      {/* ── Page Header ─────────────────────────────── */}
      <div className=\"flex items-center justify-between mb-8\">
        <div>
          <div className=\"flex items-center gap-2 mb-1\">
            <h1
              className=\"text-[28px] font-bold tracking-tight\"
              style={{
                background: 'linear-gradient(135deg, #e2e8f8 0%, #8b9dc0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Explore
            </h1>
          </div>
          <p className=\"text-[13px]\" style={{ color: 'var(--color-text-muted)' }}>
            Find referral partners •{\" \"}
            <span style={{ color: 'var(--color-primary)' }}>{filtered.length} listings</span>
          </p>
        </div>

        {/* Sort Select */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className=\"text-[12px] rounded-xl px-3 py-2 outline-none cursor-pointer transition-all\"
          style={{
            background: 'rgba(13,17,30,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--color-text-secondary)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <option value=\"newest\">Newest first</option>
          <option value=\"taps\">Most popular</option>
        </select>
      </div>

      {/* ── Search Bar ──────────────────────────────── */}
      <div className=\"relative mb-4\">
        <Icon
          name=\"search\"
          size={14}
          className=\"absolute left-3.5 top-1/2 -translate-y-1/2\"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <input
          type=\"text\"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder=\"Search by name, username, or listing…\"
          className=\"w-full text-[13px] rounded-xl pl-9 pr-9 py-3 outline-none transition-all\"
          style={{
            background: 'rgba(8,12,24,0.6)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'var(--color-text)',
            backdropFilter: 'blur(8px)',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor='rgba(91,141,239,0.4)';
            e.currentTarget.style.boxShadow='0 0 0 3px rgba(91,141,239,0.08)';
            e.currentTarget.style.background='rgba(8,12,24,0.85)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';
            e.currentTarget.style.boxShadow='none';
            e.currentTarget.style.background='rgba(8,12,24,0.6)';
          }}
        />
        {search && (
          <button
            onClick={() => setSearch(\"\")}
            className=\"absolute right-3 top-1/2 -translate-y-1/2 transition-opacity\"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Icon name=\"x\" size={14} />
          </button>
        )}
      </div>

      {/* ── Category Chips ───────────────────────────── */}
      <div className=\"mb-6\">
        <CategoryChips selected={category} onSelect={setCategory} />
      </div>

      {/* ── Pull-to-refresh indicator ────────────────── */}
      {refreshing && (
        <div className=\"flex justify-center py-4\">
          <div className=\"spinner\" />
        </div>
      )}

      {/* ── Listings Grid ────────────────────────────── */}
      {loading ? (
        <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">
          {[...Array(6)].map((_, i) => <ListingSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className=\"text-center py-20 animate-fadeIn\">
          <div
            className=\"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5\"
            style={{ background: 'rgba(91,141,239,0.06)', border: '1px solid rgba(91,141,239,0.1)' }}
          >
            <Icon name=\"search\" size={24} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <p className=\"text-[16px] font-semibold mb-2\" style={{ color: 'var(--color-text)' }}>
            {search || category ? \"No matches found\" : \"No listings yet\"}
          </p>
          <p className=\"text-[13px] mb-7 max-w-xs mx-auto leading-relaxed\" style={{ color: 'var(--color-text-secondary)' }}>
            {search || category
              ? \"Try a different search term or category\"
              : \"Be the first to post a referral exchange listing\"}
          </p>
          {search || category ? (
            <button
              onClick={() => { setSearch(\"\"); setCategory(\"\"); }}
              className=\"px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all\"
              style={{ background: 'linear-gradient(135deg, #5b8def, #9b73f0)', boxShadow: '0 4px 16px rgba(91,141,239,0.3)' }}
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => router.push(\"/post\")}
              className=\"px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all\"
              style={{ background: 'linear-gradient(135deg, #5b8def, #9b73f0)', boxShadow: '0 4px 16px rgba(91,141,239,0.3)' }}
            >
              Post a Listing
            </button>
          )}
        </div>
      ) : (
        <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">
          {filtered.map((l, i) => (
            <div
              key={l.id}
              className=\"animate-fadeIn\"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ListingCard
                listing={l}
                userData={l.userData}
                onClick={() => router.push(`/listing/${l.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

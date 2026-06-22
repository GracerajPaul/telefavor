"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import CategoryChips from "../../../components/CategoryChips";
import { ListingSkeleton } from "../../../components/Skeleton";
import { getActiveListings, getUser } from "../../../services/database";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Taps", value: "taps" },
];

export default function ExplorePage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [userDataMap, setUserDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const pullDist = useRef(0);
  const [pullProgress, setPullProgress] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const listingsData = await getActiveListings();
      setListings(listingsData);
      const uids = [...new Set(listingsData.map((l) => l.user_id))];
      const userMap = {};
      await Promise.all(uids.map(async (uid) => {
        const u = await getUser(uid);
        if (u) userMap[uid] = u;
      }));
      setUserDataMap(userMap);
    } catch {
      // silent
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPullProgress(0);
    await fetchData();
  };

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0) touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      const dist = e.touches[0].clientY - touchStartY.current;
      if (dist > 0) { pullDist.current = dist; setPullProgress(Math.min(dist / 80, 1)); }
    }
  };
  const handleTouchEnd = () => {
    if (pullDist.current > 80) handleRefresh();
    pullDist.current = 0;
    setPullProgress(0);
  };

  const filtered = useMemo(() => {
    let result = [...listings];
    if (category !== "All") {
      result = result.filter((l) => l.title?.toLowerCase().includes(category.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.telegram_username?.toLowerCase().includes(q) ||
          userDataMap[l.user_id]?.display_name?.toLowerCase().includes(q)
      );
    }
    if (sort === "taps") {
      result.sort((a, b) => (b.contact_taps || 0) - (a.contact_taps || 0));
    } else {
      result.sort((a, b) => new Date(b.posted_at || 0) - new Date(a.posted_at || 0));
    }
    return result;
  }, [listings, category, search, sort, userDataMap]);

  const hasListings = listings.length > 0;
  const activeFilters = (category !== "All" ? 1 : 0) + (search.trim() ? 1 : 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">
          Explore <span className="text-[#06B6D4]">Listings</span>
        </h1>
        <p className="text-[#94A3B8] text-[15px] mt-1">
          Find referral exchange partners and grow your network on Telegram
        </p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1 group">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#06B6D4] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings, users..."
            className="w-full bg-[#151230] text-white text-[14px] rounded-xl pl-9 pr-3 py-2.5 outline-none border border-transparent focus:border-[#06B6D4] transition-all duration-200 placeholder:text-[#94A3B8] focus:shadow-lg focus:shadow-[#06B6D4]/10"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors text-[16px] leading-none">×</button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className={`h-full px-3 rounded-xl text-[13px] font-medium border transition-all duration-200 ${
              sort !== "newest"
                ? "bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40"
                : "bg-[#151230] text-[#94A3B8] border-transparent hover:bg-[#1D1940]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="inline mr-1">
              <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {sort === "taps" ? "Taps" : "New"}
          </button>
          {showSort && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-[#151230] border border-[#1E1B3A] rounded-xl p-1 min-w-[140px] shadow-xl animate-scaleIn origin-top-right">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setShowSort(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      sort === opt.value
                        ? "bg-[#06B6D4] text-white"
                        : "text-[#94A3B8] hover:text-white hover:bg-[#1D1940]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <CategoryChips selected={category} onSelect={setCategory} />
      </div>

      {/* Listings */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mt-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pullProgress > 0 && <div className="flex justify-center py-3"><div className="spinner" style={{ opacity: pullProgress }} /></div>}
        {refreshing && <div className="flex justify-center py-3"><div className="spinner" /></div>}

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : !hasListings ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-[#151230] rounded-2xl flex items-center justify-center mb-4 animate-float">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#06B6D4" strokeWidth="1.5"/>
                <path d="M12 8V12M12 16H12.01" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[#94A3B8] text-[15px]">No listings yet</p>
            <p className="text-[#94A3B8] text-[13px] mt-1">Be the first to post a referral</p>
            <button onClick={() => router.push("/post")} className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[14px] font-medium active:scale-95 hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all duration-200">Post a Listing</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-[#151230] rounded-2xl flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#06B6D4" strokeWidth="1.5"/>
                <path d="M16 16L21 21" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[#94A3B8] text-[15px]">No matches found</p>
            <p className="text-[#94A3B8] text-[13px] mt-1">Try changing your search or filters</p>
            {activeFilters > 0 && (
              <button
                onClick={() => { setSearch(""); setCategory("All"); setSort("newest"); }}
                className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[14px] font-medium active:scale-95 hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3">
              <p className="text-[12px] text-[#94A3B8]">
                {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
                {activeFilters > 0 && " found"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-8">
              {filtered.map((listing, idx) => {
                const userData = userDataMap[listing.user_id];
                if (!userData) return null;
                const initial = (userData.display_name || "?").charAt(0).toUpperCase();

                return (
                  <button
                    key={listing.id}
                    onClick={() => router.push(`/listing/${listing.id}`)}
                    className="w-full text-left bg-[#151230] transition-all duration-300 animate-slideUp card-hover rounded-xl p-5 border border-[#1E1B3A] hover:border-[#06B6D4]/30 flex flex-col"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <p className="text-[15px] font-semibold text-white leading-snug line-clamp-2 mb-3">{listing.title}</p>
                    {listing.message && <p className="text-[12px] text-[#94A3B8] mb-3 line-clamp-2 leading-relaxed">{listing.message}</p>}
                    <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-[#1E1B3A]">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] flex items-center justify-center text-white text-[10px] font-semibold">
                        {userData.photo_url ? (
                          <img src={userData.photo_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-white truncate">{userData.display_name || "Unknown"}</p>
                      </div>
                      <span className="text-[10px] text-[#94A3B8]">{timeAgo(listing.posted_at)}</span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-[#22C55E]">{userData.green_ratings || 0}</span>
                        <span className="text-[#EF4444]">{userData.red_ratings || 0}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

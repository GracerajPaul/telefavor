"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getActiveListings, getUser } from "../../../services/database";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/Toast";
import ListingCard from "../../../components/ListingCard";
import CategoryChips from "../../../components/CategoryChips";
import { ListingSkeleton } from "../../../components/Skeleton";

export default function ExplorePage() {
  const router = useRouter();
  const { user: fbUser } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [refreshing, setRefreshing] = useState(false);
  const touchStart = useRef(0);

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
      toast("Failed to load listings", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
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
        const name = (l.userData?.display_name || "").toLowerCase();
        const user = (l.telegram_username || "").toLowerCase();
        const title = l.title.toLowerCase();
        if (!name.includes(q) && !user.includes(q) && !title.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => sort === "newest" ? new Date(b.posted_at) - new Date(a.posted_at) : (b.contact_taps || 0) - (a.contact_taps || 0));

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-text">Explore</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{filtered.length} listings</p>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="text-[12px] rounded-lg px-3 py-2 outline-none bg-bg-card text-text-secondary border border-border cursor-pointer">
          <option value="newest">Newest</option>
          <option value="taps">Most popular</option>
        </select>
      </div>

      <div className="relative mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-4.35-4.35" />
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, username, or listing..."
          className="w-full text-[13px] rounded-lg pl-9 pr-3 py-2.5 outline-none bg-bg-card text-text border border-border placeholder:text-text-muted focus:border-accent transition-colors" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="mb-6">
        <CategoryChips selected={category} onSelect={setCategory} />
      </div>

      {refreshing && <div className="flex justify-center py-4"><div className="spinner" /></div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <ListingSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-xl bg-bg-card border border-border flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-[16px] font-semibold mb-1 text-text">{search || category ? "No matches found" : "No listings yet"}</p>
          <p className="text-[13px] text-text-secondary mb-7 max-w-xs mx-auto">
            {search || category ? "Try a different search term or category" : "Be the first to post a referral exchange listing"}
          </p>
          {search || category ? (
            <button onClick={() => { setSearch(""); setCategory(""); }}
              className="h-10 px-5 rounded-full bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors">
              Clear Filters
            </button>
          ) : (
            <button onClick={() => router.push("/post")}
              className="h-10 px-5 rounded-full bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors">
              Post a Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((l, i) => (
            <ListingCard key={l.id} listing={l} userData={l.userData} onClick={() => router.push(`/listing/${l.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

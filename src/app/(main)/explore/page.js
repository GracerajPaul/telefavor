"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getActiveListings, getUser } from "../../../services/database";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/Toast";
import ListingCard from "../../../components/ListingCard";
import CategoryChips from "../../../components/CategoryChips";
import { ListingSkeleton } from "../../../components/Skeleton";
import Icon from "../../../components/Icon";

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
      toast("Failed to load listings", "error");
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
        const name = (l.userData?.display_name || "").toLowerCase();
        const user = (l.telegram_username || "").toLowerCase();
        const title = l.title.toLowerCase();
        if (!name.includes(q) && !user.includes(q) && !title.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => sort === "newest" ? new Date(b.posted_at) - new Date(a.posted_at) : (b.contact_taps || 0) - (a.contact_taps || 0));

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className="animate-fadeIn" style={{ marginBottom: "250px" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-light text-text" style={{ fontFamily: "var(--font-heading)" }}>Explore</h1>
          <p className="text-text-secondary text-[13px] mt-1.5">Find referral partners</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-bg-inset border border-border text-text text-[12px] rounded-lg px-2.5 py-2 outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
          >
            <option value="newest">Newest</option>
            <option value="taps">Most Taps</option>
          </select>
        </div>
      </div>

      <div className="relative mb-5">
        <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings..."
          className="w-full bg-bg-inset border border-border text-text text-[13px] rounded-lg pl-8 pr-8 py-2.5 outline-none focus:border-primary transition-colors placeholder:text-text-muted"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      <div className="mb-5">
        <CategoryChips selected={category} onSelect={setCategory} />
      </div>

      {refreshing && (
        <div className="flex justify-center py-3">
          <div className="spinner" />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <ListingSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="w-14 h-14 rounded-xl bg-bg-inset flex items-center justify-center mx-auto mb-4">
            <Icon name="search" size={22} className="text-text-muted" />
          </div>
          <p className="text-[15px] font-medium text-text mb-2">
            {search || category ? "No matches found" : "No listings yet"}
          </p>
          <p className="text-[12px] text-text-secondary mb-6 max-w-xs mx-auto leading-relaxed">
            {search || category
              ? "Try a different search term or category"
              : "Be the first to post a referral exchange listing"}
          </p>
          {search || category ? (
            <button onClick={() => { setSearch(""); setCategory(""); }} className="px-4 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover transition-colors">
              Clear Filters
            </button>
          ) : (
            <button onClick={() => router.push("/post")} className="px-4 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover transition-colors">
              Post a Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((l, i) => (
            <div key={l.id} className="animate-fadeIn" style={{ animationDelay: `${i * 40}ms` }}>
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

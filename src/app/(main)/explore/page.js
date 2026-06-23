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
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-text">Explore</h1>
          <p className="text-text-secondary text-[14px] mt-1">Find referral partners</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-bg-elevated border border-border text-text text-[13px] rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
          >
            <option value="newest">Newest</option>
            <option value="taps">Most Taps</option>
          </select>
        </div>
      </div>

      <div className="relative mb-4">
        <Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings..."
          className="w-full bg-bg-elevated border border-border text-text text-[14px] rounded-xl pl-10 pr-9 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
            <Icon name="x" size={16} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <ListingSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center mx-auto mb-4">
            <Icon name="search" size={24} className="text-text-muted" />
          </div>
          <p className="text-[16px] font-medium text-text mb-2">
            {search || category ? "No matches found" : "No listings yet"}
          </p>
          <p className="text-[13px] text-text-secondary mb-6 max-w-xs mx-auto leading-relaxed">
            {search || category
              ? "Try a different search term or category"
              : "Be the first to post a referral exchange listing"}
          </p>
          {search || category ? (
            <button onClick={() => { setSearch(""); setCategory(""); }} className="px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-all active:scale-[0.98]">
              Clear Filters
            </button>
          ) : (
            <button onClick={() => router.push("/post")} className="px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-all active:scale-[0.98]">
              Post a Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((l, i) => (
            <div key={l.id} className="animate-slideUp" style={{ animationDelay: `${i * 50}ms` }}>
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

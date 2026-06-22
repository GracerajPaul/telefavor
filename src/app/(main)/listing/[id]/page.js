"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Avatar from "../../../../components/Avatar";
import TrustScoreSection from "../../../../components/TrustScoreSection";
import RatingSheet from "../../../../components/RatingSheet";
import { ProfileSkeleton } from "../../../../components/Skeleton";
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../components/Toast";
import { getListing, getUser, getRating, createRating } from "../../../../services/database";

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: fbUser, refreshProfile } = useAuth();
  const toast = useToast();

  const [listing, setListing] = useState(null);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);
  const visibilityHandled = useRef(false);

  const isOwnListing = fbUser?.id === listing?.user_id;

  const loadPoster = async (userId) => {
    const data = await getUser(userId);
    if (data) setPoster(data);
  };

  useEffect(() => {
    const load = async () => {
      const listingData = await getListing(id);
      if (!listingData || !listingData.is_active) { router.replace("/explore"); return; }
      setListing(listingData);
      await loadPoster(listingData.user_id);
      if (fbUser) { const existing = await getRating(fbUser.id, id); if (existing) setAlreadyRated(true); }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!pendingReview || alreadyRated) return;
    const handler = () => {
      if (document.visibilityState === "visible" && !visibilityHandled.current) {
        visibilityHandled.current = true;
        setShowRating(true);
        setPendingReview(false);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [pendingReview, alreadyRated]);

  const handleContact = async () => {
    if (!fbUser || isOwnListing) return;
    const existing = await getRating(fbUser.id, id);
    if (existing) { setAlreadyRated(true); window.open(`https://t.me/${listing.telegram_username}`, "_blank"); return; }
    visibilityHandled.current = false;
    setPendingReview(true);
    window.open(`https://t.me/${listing.telegram_username}`, "_blank");
  };

  const handleRate = async (result) => {
    if (!fbUser || !listing || isOwnListing) return;
    setRatingLoading(true);
    try {
      await createRating(fbUser.id, listing.user_id, id, result);
      await refreshProfile();
      await loadPoster(listing.user_id);
      setAlreadyRated(true); setShowRating(false);
      toast("Rating submitted! Trust score updated.");
    } catch (e) {
      toast(e?.message || "Failed to submit rating", "error");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleSkip = () => { setShowRating(false); };

  if (loading) return <div className="flex justify-center py-20"><ProfileSkeleton /></div>;
  if (!listing || !poster) return null;

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Listing <span className="text-[#06B6D4]">Detail</span></h1>
        <p className="text-[#94A3B8] text-[15px] mt-1">View listing details, check trust score, and connect via Telegram.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-6">
            <div className="flex items-center gap-5">
              <Avatar src={poster.photo_url} name={poster.display_name} size={80} onClick={() => router.push(`/user/${listing.user_id}`)} />
              <div className="min-w-0">
                <h2 className="text-[20px] font-bold text-white">{poster.display_name || "Unknown"}</h2>
                <a href={`https://t.me/${listing.telegram_username}`} target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] text-[15px] hover:underline">@{listing.telegram_username}</a>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] text-[12px] font-medium">{listing.title}</span>
                </div>
              </div>
            </div>
          </div>

          {listing.message && (
            <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-6">
              <h3 className="text-[13px] text-[#94A3B8] font-medium uppercase tracking-wider mb-3">About this referral</h3>
              <p className="text-[14px] text-white leading-relaxed whitespace-pre-wrap">{listing.message}</p>
            </div>
          )}
          <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-6">
            <h3 className="text-[13px] text-[#94A3B8] font-medium uppercase tracking-wider mb-4">Trust Score</h3>
            <TrustScoreSection userData={poster} size="large" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-6">
            <div className="space-y-3 text-[13px] text-[#94A3B8]">
              <div className="flex items-center justify-between">
                <span>Posted</span>
                <span className="text-white">{listing.posted_at ? new Date(listing.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}</span>
              </div>
              <div className="border-t border-[#1E1B3A] pt-3">
                <button
                  onClick={handleContact}
                  disabled={isOwnListing}
                  className="ripple w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[14px] font-semibold disabled:opacity-40 hover:shadow-lg hover:shadow-[#06B6D4]/30 active:scale-[0.98] transition-all duration-200"
                >
                  {isOwnListing ? "This is your listing" : "Contact on Telegram"}
                </button>
                {!isOwnListing && !alreadyRated && (
                  <p className="text-[11px] text-center mt-2">You&apos;ll be asked to rate after contacting</p>
                )}
                {alreadyRated && (
                  <p className="text-[11px] text-[#22C55E] text-center mt-2">✓ You rated this swap</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RatingSheet isOpen={showRating} onClose={() => setShowRating(false)} username={listing.telegram_username} onRate={handleRate} onSkip={handleSkip} loading={ratingLoading} />
    </div>
  );
}

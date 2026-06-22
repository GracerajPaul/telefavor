"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Avatar from "../../../../components/Avatar";
import TrustScoreSection from "../../../../components/TrustScoreSection";
import RatingSheet from "../../../../components/RatingSheet";
import Badge from "../../../../components/Badge";
import { ProfileSkeleton } from "../../../../components/Skeleton";
import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../components/Toast";
import { getUser, getUserListings, createRating } from "../../../../services/database";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const { user: fbUser, refreshProfile } = useAuth();
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const isSelf = fbUser?.id === userId;

  useEffect(() => {
    const load = async () => {
      const data = await getUser(userId);
      if (!data) { router.replace("/explore"); return; }
      setUserData(data);
      const userListings = await getUserListings(userId);
      setListings(userListings);
      setLoading(false);
    };
    load();
  }, [userId]);

  const handleContact = () => {
    if (!fbUser || isSelf || !userData) return;
    window.open(`https://t.me/${userData.telegram_username}`, "_blank");
    setShowRating(true);
  };

  const handleRate = async (result) => {
    if (!fbUser || !userData || isSelf) return;
    setRatingLoading(true);
    try { await createRating(fbUser.id, userId, "profile_" + userId, result); await refreshProfile(); setShowRating(false); toast("Rating submitted!"); }
    catch { toast("Failed to submit rating", "error"); } finally { setRatingLoading(false); }
  };

  if (loading) return <ProfileSkeleton />;
  if (!userData) return null;

  const totalRatings = (userData.green_ratings || 0) + (userData.red_ratings || 0);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push("/explore")} className="w-7 h-7 rounded-full bg-[#151230] border border-[#1E1B3A] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1D1940] transition-all flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h1 className="text-[20px] font-bold text-white">Public <span className="text-[#06B6D4]">Profile</span></h1>
      </div>

      {/* Profile Card */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4 md:p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-4 sm:flex-col sm:items-center">
            <Avatar src={userData.photo_url} name={userData.display_name} size={48} />
            {!isSelf && (
              <button onClick={handleContact} className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] text-[12px] font-semibold hover:bg-[#06B6D4]/25 transition-colors active:scale-95">
                Contact
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[18px] md:text-[20px] font-bold text-white truncate">{userData.display_name || "Unknown"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <a href={`https://t.me/${userData.telegram_username}`} target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] text-[13px] md:text-[14px] hover:underline font-medium truncate">@{userData.telegram_username}</a>
                  {userData.telegram_verified && (
                    <span className="text-[11px] text-[#22C55E] font-medium">✓ Verified</span>
                  )}
                  {!isSelf && (
                    <button onClick={handleContact} className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] text-[12px] font-semibold hover:bg-[#06B6D4]/25 transition-colors active:scale-95">
                      Contact
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge level={null} score={userData.trust_score} ratingsCount={totalRatings} />
                {totalRatings > 0 ? (
                  <span className="text-[12px] text-[#94A3B8]">{userData.green_ratings || 0}/{totalRatings}</span>
                ) : (
                  <span className="text-[12px] text-[#5A5A7A]">No ratings</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[12px] text-[#94A3B8]">
              <span>Joined {userData.created_at ? new Date(userData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "recently"}</span>
              <span className="text-[#1E1B3A]">·</span>
              <span>{listings.length} listing{listings.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="text-center px-2.5 py-1 rounded-lg bg-[#0D0B1A] min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-white">{userData.total_listings_posted || 0}</p>
                <p className="text-[9px] text-[#94A3B8]">Posts</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-[#0D0B1A] min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-[#22C55E]">{userData.green_ratings || 0}</p>
                <p className="text-[9px] text-[#94A3B8]">Green</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-[#0D0B1A] min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-[#EF4444]">{userData.red_ratings || 0}</p>
                <p className="text-[9px] text-[#94A3B8]">Red</p>
              </div>
            </div>
            {userData.description && (
              <p className="text-[13px] text-[#94A3B8] mt-3 pt-3 border-t border-[#1E1B3A] leading-relaxed">{userData.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Trust Score Detail */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4 mb-4">
        <h3 className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mb-3">Trust Score</h3>
        <TrustScoreSection userData={userData} size="large" />
      </div>

      {/* User's Listings */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4">
        <h3 className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mb-3">Listings ({listings.length})</h3>
        {listings.length === 0 ? (
          <p className="text-[13px] text-[#5A5A7A] italic">No listings yet</p>
        ) : (
          <div className="space-y-2">
            {listings.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0D0B1A] border border-[#1E1B3A] hover:border-[#06B6D4]/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] text-white font-medium">{l.title}</p>
                  {l.message && <p className="text-[12px] text-[#94A3B8] mt-1 leading-relaxed">{l.message}</p>}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#5A5A7A]">
                    <span>{new Date(l.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="text-[#1E1B3A]">|</span>
                    <span>@{l.telegram_username}</span>
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ml-3 flex-shrink-0 ${l.is_active ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#94A3B8]/15 text-[#94A3B8]"}`}>{l.is_active ? "Active" : "Expired"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <RatingSheet isOpen={showRating} onClose={() => setShowRating(false)} username={userData.telegram_username} onRate={handleRate} onSkip={() => setShowRating(false)} loading={ratingLoading} />
    </div>
  );
}

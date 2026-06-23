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
import Icon from "../../../../components/Icon";

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
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push("/explore")} className="w-7 h-7 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text hover:bg-bg-elevated transition-all flex-shrink-0">
          <Icon name="arrow-left" size={12} />
        </button>
        <h1 className="text-[20px] font-bold text-text">Public Profile</h1>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-4 sm:flex-col sm:items-center">
            <Avatar src={userData.photo_url} name={userData.display_name} size={48} />
            {!isSelf && (
              <button onClick={handleContact} className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-[12px] font-semibold hover:bg-primary/25 transition-colors active:scale-95">
                <Icon name="send" size={12} />
                Contact
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[18px] md:text-[20px] font-bold text-text truncate">{userData.display_name || "Unknown"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <a href={`https://t.me/${userData.telegram_username}`} target="_blank" rel="noopener noreferrer" className="text-primary text-[13px] md:text-[14px] hover:underline font-medium truncate">@{userData.telegram_username}</a>
                  {userData.telegram_verified && (
                    <span className="text-[11px] text-green font-medium">✓ Verified</span>
                  )}
                  {!isSelf && (
                    <button onClick={handleContact} className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-primary-soft text-primary text-[12px] font-semibold hover:bg-primary/25 transition-colors active:scale-95">
                      <Icon name="send" size={12} />
                      Contact
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge level={null} score={userData.trust_score} ratingsCount={totalRatings} />
                {totalRatings > 0 ? (
                  <span className="text-[12px] text-text-muted">{userData.green_ratings || 0}/{totalRatings}</span>
                ) : (
                  <span className="text-[12px] text-text-tertiary">No ratings</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[12px] text-text-muted">
              <span>Joined {userData.created_at ? new Date(userData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "recently"}</span>
              <span className="text-border">·</span>
              <span>{listings.length} listing{listings.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="text-center px-2.5 py-1 rounded-lg bg-bg-inset min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-text">{userData.total_listings_posted || 0}</p>
                <p className="text-[9px] text-text-muted">Posts</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-bg-inset min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-green">{userData.green_ratings || 0}</p>
                <p className="text-[9px] text-text-muted">Green</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-bg-inset min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-red">{userData.red_ratings || 0}</p>
                <p className="text-[9px] text-text-muted">Red</p>
              </div>
            </div>
            {userData.description && (
              <p className="text-[13px] text-text-secondary mt-3 pt-3 border-t border-border leading-relaxed">{userData.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-3">Trust Score</h3>
        <TrustScoreSection userData={userData} size="large" />
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4">
        <h3 className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-3">Listings ({listings.length})</h3>
        {listings.length === 0 ? (
          <p className="text-[13px] text-text-tertiary italic">No listings yet</p>
        ) : (
          <div className="space-y-2">
            {listings.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-inset border border-border hover:border-primary/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] text-text font-medium">{l.title}</p>
                  {l.message && <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{l.message}</p>}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-tertiary">
                    <span>{new Date(l.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="text-border">|</span>
                    <span>@{l.telegram_username}</span>
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ml-3 flex-shrink-0 ${l.is_active ? "bg-green/15 text-green" : "bg-text-muted/15 text-text-muted"}`}>{l.is_active ? "Active" : "Expired"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <RatingSheet isOpen={showRating} onClose={() => setShowRating(false)} username={userData.telegram_username} onRate={handleRate} onSkip={() => setShowRating(false)} loading={ratingLoading} />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../../../components/Avatar";
import TrustScoreSection from "../../../components/TrustScoreSection";
import Badge from "../../../components/Badge";
import VerificationStatus from "../../../components/VerificationStatus";
import { ProfileSkeleton } from "../../../components/Skeleton";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/Toast";
import { signOut } from "../../../services/auth";
import { updateUser, getUserListings, updateDescription } from "../../../services/database";

export default function MyProfilePage() {
  const router = useRouter();
  const { user: fbUser, profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [description, setDescription] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (fbUser) {
        const userListings = await getUserListings(fbUser.id);
        setListings(userListings);
      }
      setLoadingListings(false);
    };
    fetch();
  }, [fbUser]);

  const handleSignOut = async () => { await signOut(); router.push("/"); };

  const handleSaveUsername = async () => {
    const cleaned = usernameInput.replace(/^@/, "").trim();
    if (!cleaned) return;
    setSavingUsername(true);
    try { await updateUser(fbUser.id, { telegram_username: cleaned }); await refreshProfile(); toast("Username updated!"); setEditingUsername(false); }
    catch { toast("Failed to update", "error"); } finally { setSavingUsername(false); }
  };

  const handleSaveDescription = async () => {
    setSavingDesc(true);
    try { await updateDescription(fbUser.id, description.trim()); await refreshProfile(); toast("Description saved!"); setEditingDesc(false); }
    catch { toast("Failed to save", "error"); } finally { setSavingDesc(false); }
  };

  const totalRatings = (profile?.green_ratings || 0) + (profile?.red_ratings || 0);

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">My <span className="text-[#06B6D4]">Profile</span></h1>
        <p className="text-[#94A3B8] text-[15px] mt-1">Manage your account, view your trust score, and track listing history.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4 md:p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-4 sm:flex-col sm:items-center">
            <Avatar src={profile.photo_url} name={profile.display_name} size={48} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[18px] md:text-[20px] font-bold text-white truncate">{profile.display_name || "Unknown"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-[#06B6D4] text-[13px] md:text-[14px] font-medium truncate">@{profile.telegram_username || "not set"}</span>
                  {profile.telegram_verified && (
                    <span className="text-[11px] text-[#22C55E] font-medium">✓ Verified</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge level={null} score={profile.trust_score} ratingsCount={totalRatings} />
                {totalRatings > 0 ? (
                  <span className="text-[12px] text-[#94A3B8]">{profile.green_ratings || 0}/{totalRatings}</span>
                ) : (
                  <span className="text-[12px] text-[#5A5A7A]">No ratings</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[12px] text-[#94A3B8]">
              <span>Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "recently"}</span>
              <span className="text-[#1E1B3A]">·</span>
              <span>{listings.length} listing{listings.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="text-center px-2.5 py-1 rounded-lg bg-[#0D0B1A] min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-white">{profile.total_listings_posted || 0}</p>
                <p className="text-[9px] text-[#94A3B8]">Posts</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-[#0D0B1A] min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-[#22C55E]">{profile.green_ratings || 0}</p>
                <p className="text-[9px] text-[#94A3B8]">Green</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-[#0D0B1A] min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-[#EF4444]">{profile.red_ratings || 0}</p>
                <p className="text-[9px] text-[#94A3B8]">Red</p>
              </div>
            </div>
            {editingDesc ? (
              <div className="mt-3 pt-3 border-t border-[#1E1B3A] space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full bg-[#0D0B1A] text-white text-[12px] rounded-xl p-3 outline-none border border-transparent focus:border-[#06B6D4] transition-colors resize-none h-20 placeholder:text-[#94A3B8]"
                  maxLength={300}
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8]">{description.length}/300</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingDesc(false)} className="px-3 py-1 rounded-lg bg-[#0D0B1A] text-[#94A3B8] text-[11px] font-medium hover:bg-[#1D1940] transition-colors">Cancel</button>
                    <button onClick={handleSaveDescription} disabled={savingDesc} className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[11px] font-medium disabled:opacity-50 active:scale-95 transition-all">{savingDesc ? "Saving..." : "Save"}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 mt-3 pt-3 border-t border-[#1E1B3A]">
                <p className={`text-[13px] leading-relaxed ${profile.description ? "text-[#94A3B8]" : "text-[#5A5A7A] italic"}`}>
                  {profile.description || "No description set"}
                </p>
                <button onClick={() => { setDescription(profile.description || ""); setEditingDesc(true); }} className="flex-shrink-0 text-[#06B6D4] text-[11px] font-medium hover:underline mt-0.5">Edit</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Score */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4 mb-4">
        <h3 className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mb-3">Trust Score</h3>
        <TrustScoreSection userData={profile} size="large" />
      </div>

      {/* Listing History */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4 mb-4">
        <h3 className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mb-3">Listings ({listings.length})</h3>
        {loadingListings ? <div className="flex justify-center py-4"><div className="spinner" /></div>
        : listings.length === 0 ? <p className="text-[13px] text-[#5A5A7A] italic">No listings yet</p>
        : <div className="space-y-2">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0D0B1A] border border-[#1E1B3A] hover:border-[#06B6D4]/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-white font-medium">{l.title}</p>
                {l.message && <p className="text-[12px] text-[#94A3B8] mt-1 leading-relaxed">{l.message}</p>}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#5A5A7A]">
                  <span>{l.posted_at ? new Date(l.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                  <span className="text-[#1E1B3A]">|</span>
                  <span>@{l.telegram_username || profile.telegram_username}</span>
                </div>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ml-3 flex-shrink-0 ${l.is_active ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#94A3B8]/15 text-[#94A3B8]"}`}>{l.is_active ? "Active" : "Expired"}</span>
            </div>
          ))}
        </div>}
      </div>

      {/* Settings */}
      <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-4 mb-4">
        <h3 className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mb-3">Settings</h3>
        <div className="space-y-1">
          <button onClick={() => router.push(`/user/${fbUser.id}`)} className="ripple w-full flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-[#0D0B1A] transition-colors">
            <span className="text-[14px] text-white">View Public Profile</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          {profile.telegram_verified ? (
            <div className="flex items-center justify-between px-3 py-3 rounded-xl cursor-default">
              <span className="text-[14px] text-[#22C55E] flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Verified Telegram
              </span>
            </div>
          ) : (
            <div className="px-3 py-2">
              <VerificationStatus />
            </div>
          )}
          <button onClick={() => { setUsernameInput(profile.telegram_username || ""); setEditingUsername(true); }} disabled={profile.telegram_verified} className="ripple w-full flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-[#0D0B1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <span className="text-[14px] text-white">{profile.telegram_verified ? "Username Locked" : "Edit Username"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button onClick={handleSignOut} className="ripple w-full flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-[#0D0B1A] transition-colors">
            <span className="text-[14px] text-[#EF4444]">Sign Out</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M16 17L21 12L16 7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      <div className="text-center text-[12px] text-[#94A3B8] space-y-1">
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => router.push("/features")} className="hover:text-white transition-colors">Features</button>
          <span className="text-[#1E1B3A]">·</span>
          <button onClick={() => router.push("/terms")} className="hover:text-white transition-colors">Terms</button>
        </div>
      </div>

      {/* Edit Username Modal */}
      {editingUsername && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={() => setEditingUsername(false)} />
          <div className="relative w-full max-w-md bg-[#151230] rounded-2xl p-6 animate-scaleIn border border-[#1E1B3A] shadow-2xl">
            <h2 className="text-[17px] font-semibold text-white mb-4">Edit Username</h2>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[16px]">@</span>
              <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="username" className="w-full bg-[#1A1A30] text-white text-[16px] rounded-xl pl-8 pr-4 py-3 outline-none border border-transparent focus:border-[#06B6D4] transition-colors" autoFocus />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingUsername(false)} className="flex-1 py-3 rounded-xl bg-[#1A1A30] text-[#94A3B8] text-[14px] font-medium hover:bg-[#1D1940] transition-colors active:scale-95">Cancel</button>
              <button onClick={handleSaveUsername} disabled={savingUsername || !usernameInput.trim()} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[14px] font-medium disabled:opacity-50 active:scale-95 transition-all hover:shadow-lg hover:shadow-[#06B6D4]/30">{savingUsername ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

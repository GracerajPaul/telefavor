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
import Icon from "../../../components/Icon";

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

  const handleSignOut = async () => {
    if (fbUser?.isPremium) {
      localStorage.removeItem("premium_user_id");
      window.location.href = "/";
    } else {
      await signOut();
    }
  };

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
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-text">My Profile</h1>
        <p className="text-text-secondary text-[14px] mt-1">Manage your account and track your reputation</p>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 md:p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-4 sm:flex-col sm:items-center">
            <Avatar src={profile.photo_url} name={profile.display_name} size={48} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[18px] md:text-[20px] font-bold text-text truncate">{profile.display_name || "Unknown"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-primary text-[13px] md:text-[14px] font-medium truncate">@{profile.telegram_username || "not set"}</span>
                  {profile.telegram_verified && (
                    <span className="text-[11px] text-green font-medium">✓ Verified</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge level={null} score={profile.trust_score} ratingsCount={totalRatings} />
                {totalRatings > 0 ? (
                  <span className="text-[12px] text-text-muted">{profile.green_ratings || 0}/{totalRatings}</span>
                ) : (
                  <span className="text-[12px] text-text-tertiary">No ratings</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[12px] text-text-muted">
              <span>Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "recently"}</span>
              <span className="text-border">·</span>
              <span>{listings.length} listing{listings.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="text-center px-2.5 py-1 rounded-lg bg-bg-inset min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-text">{profile.total_listings_posted || 0}</p>
                <p className="text-[9px] text-text-muted">Posts</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-bg-inset min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-green">{profile.green_ratings || 0}</p>
                <p className="text-[9px] text-text-muted">Green</p>
              </div>
              <div className="text-center px-2.5 py-1 rounded-lg bg-bg-inset min-w-[52px]">
                <p className="text-[14px] md:text-[15px] font-bold text-red">{profile.red_ratings || 0}</p>
                <p className="text-[9px] text-text-muted">Red</p>
              </div>
            </div>
            {editingDesc ? (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full bg-bg-inset text-text text-[12px] rounded-xl p-3 outline-none border border-border focus:border-primary transition-colors resize-none h-20 placeholder:text-text-muted"
                  maxLength={300}
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">{description.length}/300</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingDesc(false)} className="px-3 py-1 rounded-lg bg-bg-inset text-text-muted text-[11px] font-medium hover:bg-bg-elevated transition-colors">Cancel</button>
                    <button onClick={handleSaveDescription} disabled={savingDesc} className="px-3 py-1 rounded-lg bg-primary text-white text-[11px] font-medium disabled:opacity-50 active:scale-95 transition-all">{savingDesc ? "Saving..." : "Save"}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 mt-3 pt-3 border-t border-border">
                <p className={`text-[13px] leading-relaxed ${profile.description ? "text-text-secondary" : "text-text-tertiary italic"}`}>
                  {profile.description || "No description set"}
                </p>
                <button onClick={() => { setDescription(profile.description || ""); setEditingDesc(true); }} className="flex-shrink-0 text-primary text-[11px] font-medium hover:underline mt-0.5">Edit</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-3">Trust Score</h3>
        <TrustScoreSection userData={profile} size="large" />
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-3">Listings ({listings.length})</h3>
        {loadingListings ? <div className="flex justify-center py-4"><div className="spinner" /></div>
        : listings.length === 0 ? <p className="text-[13px] text-text-tertiary italic">No listings yet</p>
        : <div className="space-y-2">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-inset border border-border hover:border-primary/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-text font-medium">{l.title}</p>
                {l.message && <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{l.message}</p>}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-tertiary">
                  <span>{l.posted_at ? new Date(l.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                  <span className="text-border">|</span>
                  <span>@{l.telegram_username || profile.telegram_username}</span>
                </div>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ml-3 flex-shrink-0 ${l.is_active ? "bg-green/15 text-green" : "bg-text-muted/15 text-text-muted"}`}>{l.is_active ? "Active" : "Expired"}</span>
            </div>
          ))}
        </div>}
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-4 mb-4">
        <h3 className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-3">Settings</h3>
        <div className="space-y-1">
          <button onClick={() => router.push(`/user/${fbUser.id}`)} className="ripple w-full flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-bg-inset transition-colors">
            <span className="text-[14px] text-text">View Public Profile</span>
            <Icon name="chevron-right" size={14} className="text-text-muted" />
          </button>
          {profile.telegram_verified ? (
            <div className="flex items-center justify-between px-3 py-3 rounded-xl cursor-default">
              <span className="text-[14px] text-green flex items-center gap-2">
                <Icon name="check" size={16} className="text-green" />
                Verified Telegram
              </span>
            </div>
          ) : profile.premium_verified ? (
            <div className="flex items-center justify-between px-3 py-3 rounded-xl cursor-default">
              <span className="text-[14px] text-yellow flex items-center gap-2">
                <Icon name="star" size={16} className="text-yellow" />
                Premium Member
              </span>
            </div>
          ) : (
            <div className="px-3 py-2">
              <VerificationStatus />
            </div>
          )}
          <button onClick={() => { setUsernameInput(profile.telegram_username || ""); setEditingUsername(true); }} disabled={!!profile.telegram_verified && !profile.premium_verified} className="ripple w-full flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-bg-inset transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <span className="text-[14px] text-text">{profile.telegram_verified && !profile.premium_verified ? "Username Locked" : "Edit Username"}</span>
            <Icon name="chevron-right" size={14} className="text-text-muted" />
          </button>
          <button onClick={handleSignOut} className="ripple w-full flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-bg-inset transition-colors">
            <span className="text-[14px] text-red">Sign Out</span>
            <Icon name="log-out" size={14} className="text-red" />
          </button>
        </div>
      </div>

      <div className="text-center text-[12px] text-text-muted">
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => router.push("/features")} className="hover:text-text-secondary transition-colors">Features</button>
          <span className="text-border">·</span>
          <button onClick={() => router.push("/community")} className="hover:text-text-secondary transition-colors">Community</button>
          <span className="text-border">·</span>
          <button onClick={() => router.push("/terms")} className="hover:text-text-secondary transition-colors">Terms</button>
        </div>
      </div>

      {editingUsername && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={() => setEditingUsername(false)} />
          <div className="relative w-full max-w-sm bg-bg-card rounded-2xl p-6 animate-scaleIn border border-border shadow-2xl">
            <h2 className="text-[17px] font-semibold text-text mb-4">Edit Username</h2>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[15px]">@</span>
              <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="username" className="w-full bg-bg-inset text-text text-[15px] rounded-xl pl-8 pr-4 py-3 outline-none border border-border focus:border-primary transition-colors" autoFocus />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingUsername(false)} className="flex-1 py-3 rounded-xl bg-bg-elevated text-text-muted text-[14px] font-medium hover:text-text hover:bg-border transition-colors active:scale-95">Cancel</button>
              <button onClick={handleSaveUsername} disabled={savingUsername || !usernameInput.trim()} className="flex-1 py-3 rounded-xl bg-primary text-white text-[14px] font-medium disabled:opacity-50 active:scale-95 transition-all">{savingUsername ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="animate-fadeIn" style={{ marginBottom: "250px" }}>
      <div className="mb-8">
        <h1 className="text-[26px] font-light text-text" style={{ fontFamily: "var(--font-heading)" }}>My Profile</h1>
        <p className="text-text-secondary text-[13px] mt-1.5">Manage your account and track your reputation</p>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:flex sm:flex-col sm:items-center">
            <Avatar src={profile.photo_url} name={profile.display_name} size={44} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[17px] font-semibold text-text truncate">{profile.display_name || "Unknown"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-primary text-[12px] md:text-[13px] font-medium truncate">@{profile.telegram_username || "not set"}</span>
                  {profile.telegram_verified && (
                    <span className="text-[10px] text-green font-medium">✓ Verified</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge level={null} score={profile.trust_score} ratingsCount={totalRatings} />
                {totalRatings > 0 ? (
                  <span className="text-[11px] text-text-muted">{profile.green_ratings || 0}/{totalRatings}</span>
                ) : (
                  <span className="text-[11px] text-text-tertiary">No ratings</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] text-text-muted">
              <span>Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "recently"}</span>
              <span className="text-border">·</span>
              <span>{listings.length} listing{listings.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="text-center px-2 py-1 rounded bg-bg-inset min-w-[48px]">
                <p className="text-[13px] font-semibold text-text">{profile.total_listings_posted || 0}</p>
                <p className="text-[8px] text-text-muted">Posts</p>
              </div>
              <div className="text-center px-2 py-1 rounded bg-bg-inset min-w-[48px]">
                <p className="text-[13px] font-semibold text-green">{profile.green_ratings || 0}</p>
                <p className="text-[8px] text-text-muted">Green</p>
              </div>
              <div className="text-center px-2 py-1 rounded bg-bg-inset min-w-[48px]">
                <p className="text-[13px] font-semibold text-red">{profile.red_ratings || 0}</p>
                <p className="text-[8px] text-text-muted">Red</p>
              </div>
            </div>
            {editingDesc ? (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full bg-bg-inset text-text text-[12px] rounded-lg p-3 outline-none border border-border focus:border-primary transition-colors resize-none h-20 placeholder:text-text-muted"
                  maxLength={300}
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{description.length}/300</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingDesc(false)} className="px-3 py-1 rounded bg-bg-inset text-text-muted text-[10px] font-medium hover:bg-bg-hover transition-colors">Cancel</button>
                    <button onClick={handleSaveDescription} disabled={savingDesc} className="px-3 py-1 rounded bg-primary text-white text-[10px] font-medium disabled:opacity-50 transition-opacity hover:bg-primary-hover">{savingDesc ? "Saving..." : "Save"}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 mt-3 pt-3 border-t border-border">
                <p className={`text-[12px] leading-relaxed ${profile.description ? "text-text-secondary" : "text-text-tertiary italic"}`}>
                  {profile.description || "No description set"}
                </p>
                <button onClick={() => { setDescription(profile.description || ""); setEditingDesc(true); }} className="flex-shrink-0 text-primary text-[10px] font-medium hover:underline mt-0.5">Edit</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5 mb-4">
        <h3 className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-3">Trust Score</h3>
        <TrustScoreSection userData={profile} size="large" />
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5 mb-4">
        <h3 className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-3">Listings ({listings.length})</h3>
        {loadingListings ? <div className="flex justify-center py-4"><div className="spinner" /></div>
        : listings.length === 0 ? <p className="text-[12px] text-text-tertiary italic">No listings yet</p>
        : <div className="space-y-2">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-inset border border-border">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-text font-medium">{l.title}</p>
                {l.message && <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{l.message}</p>}
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-tertiary">
                  <span>{l.posted_at ? new Date(l.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                  <span className="text-border">|</span>
                  <span>@{l.telegram_username || profile.telegram_username}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ml-3 flex-shrink-0 ${l.is_active ? "bg-green/10 text-green" : "bg-text-muted/10 text-text-muted"}`}>{l.is_active ? "Active" : "Expired"}</span>
            </div>
          ))}
        </div>}
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5 mb-4">
        <h3 className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-3">Settings</h3>
        <div className="space-y-1">
          <button onClick={() => router.push(`/user/${fbUser.id}`)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-bg-hover transition-colors">
            <span className="text-[13px] text-text">View Public Profile</span>
            <Icon name="chevron-right" size={12} className="text-text-muted" />
          </button>
          {profile.telegram_verified ? (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-default">
              <span className="text-[13px] text-green flex items-center gap-2">
                <Icon name="check" size={14} className="text-green" />
                Verified Telegram
              </span>
            </div>
          ) : profile.premium_verified ? (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-default">
              <span className="text-[13px] text-yellow flex items-center gap-2">
                <Icon name="star" size={14} className="text-yellow" />
                Premium Member
              </span>
            </div>
          ) : (
            <div className="px-3 py-2">
              <VerificationStatus />
            </div>
          )}
          <button onClick={() => { setUsernameInput(profile.telegram_username || ""); setEditingUsername(true); }} disabled={!!profile.telegram_verified && !profile.premium_verified} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-bg-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <span className="text-[13px] text-text">{profile.telegram_verified && !profile.premium_verified ? "Username Locked" : "Edit Username"}</span>
            <Icon name="chevron-right" size={12} className="text-text-muted" />
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-bg-hover transition-colors">
            <span className="text-[13px] text-red">Sign Out</span>
            <Icon name="log-out" size={12} className="text-red" />
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-text-muted">
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
          <div className="relative w-full max-w-sm bg-bg-dark border border-border rounded-xl p-6 animate-fadeIn">
            <h2 className="text-[15px] font-semibold text-text mb-4" style={{ fontFamily: "var(--font-heading)" }}>Edit Username</h2>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[14px]">@</span>
              <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="username" className="w-full bg-bg-inset text-text text-[14px] rounded-lg pl-7 pr-3 py-2.5 outline-none border border-border focus:border-primary transition-colors" autoFocus />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingUsername(false)} className="flex-1 py-2.5 rounded-lg border border-border text-text-secondary text-[13px] font-medium hover:bg-bg-hover hover:text-text transition-colors">Cancel</button>
              <button onClick={handleSaveUsername} disabled={savingUsername || !usernameInput.trim()} className="flex-1 py-2.5 rounded-lg bg-primary text-white text-[13px] font-medium disabled:opacity-50 transition-opacity hover:bg-primary-hover">{savingUsername ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

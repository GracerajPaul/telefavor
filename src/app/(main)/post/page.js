"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../../../components/Avatar";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/Toast";
import { LISTING_TITLES, createListing, deactivateListing, getUserActiveListing, updateUser } from "../../../services/database";
import Icon from "../../../components/Icon";

const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/i;
const MAX_MESSAGE_LENGTH = 500;

export default function PostListingPage() {
  const router = useRouter();
  const { user: fbUser, profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [selectedTitle, setSelectedTitle] = useState("");
  const [message, setMessage] = useState("");
  const [linkError, setLinkError] = useState("");
  const [existingListing, setExistingListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!fbUser) return;
      const active = await getUserActiveListing(fbUser.id);
      setExistingListing(active);
      setFetching(false);
    };
    check();
  }, [fbUser]);

  const handleMessageChange = (e) => {
    const val = e.target.value;
    if (val.length > MAX_MESSAGE_LENGTH) return;
    setMessage(val);
    if (URL_REGEX.test(val)) setLinkError("Links are not allowed in the description");
    else setLinkError("");
  };

  const handleSubmit = async () => {
    if (!selectedTitle || !fbUser || !profile) return;
    if (linkError) return;
    setLoading(true);
    try {
      if (existingListing) await deactivateListing(existingListing.id);
      await createListing(fbUser.id, profile.telegram_username, selectedTitle, message.trim() || null);
      await updateUser(fbUser.id, { total_listings_posted: (profile.total_listings_posted || 0) + 1 });
      await refreshProfile();
      toast("Listing posted!");
      router.push("/explore");
    } catch { toast("Failed to post listing", "error"); } finally { setLoading(false); }
  };

  const handleDeleteAndRepost = async () => {
    if (!existingListing) return;
    setLoading(true);
    try { await deactivateListing(existingListing.id); setExistingListing(null); setSelectedTitle(existingListing.title || ""); toast("Old listing deleted. Post a new one."); }
    catch { toast("Failed to delete", "error"); } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-text">Post a Listing</h1>
        <p className="text-text-secondary text-[14px] mt-1">Create a new referral exchange listing. Active for 24 hours.</p>
      </div>

      {existingListing && (
        <div className="mb-5 p-4 rounded-xl bg-warning/10 border border-warning/30">
          <div className="flex items-start gap-3">
            <Icon name="alert-triangle" size={18} className="text-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] text-text-secondary">You already have an active listing:</p>
              <p className="text-[14px] text-text mt-1 font-medium">{existingListing.title}</p>
              <button onClick={handleDeleteAndRepost} disabled={loading} className="mt-2 text-red text-[13px] font-medium hover:underline active:scale-95 transition-transform">Delete and Repost</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="md:col-span-3">
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <label className="text-[13px] text-text-muted font-medium block mb-3">Select Listing Type</label>
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {LISTING_TITLES.map((title) => (
                <button key={title} onClick={() => setSelectedTitle(title)} className={`ripple w-full text-left px-4 py-3 rounded-xl text-[14px] transition-all duration-200 ${selectedTitle === title ? "bg-primary-soft text-primary border border-primary/40" : "bg-bg-inset text-text hover:bg-bg-elevated border border-transparent"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedTitle === title ? "bg-primary border-primary" : "border-border"}`}>
                      {selectedTitle === title && <Icon name="check" size={12} className="text-white" />}
                    </div>
                    {title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[13px] text-text-muted font-medium">Describe your referral</label>
              <span className="text-[11px] text-text-muted">{message.length}/{MAX_MESSAGE_LENGTH}</span>
            </div>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Tell others about this referral..."
              className="w-full bg-bg-inset text-text text-[14px] rounded-xl p-3.5 outline-none border transition-colors resize-none h-36 placeholder:text-text-muted focus:border-primary"
              style={{ borderColor: linkError ? "var(--red)" : "var(--border)" }}
            />
            {linkError && <p className="text-red text-[12px] mt-1.5">{linkError}</p>}
          </div>

          <div className="bg-bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={profile?.photo_url} name={profile?.display_name} size={36} />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-text truncate">{profile?.display_name || "You"}</p>
                <p className="text-[12px] text-primary truncate">@{profile?.telegram_username || "username"}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedTitle || loading || !!linkError}
              className="ripple px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold disabled:opacity-40 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="plus" size={14} />
                  Post Listing
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

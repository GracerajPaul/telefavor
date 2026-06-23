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
    <div className="animate-fadeIn" style={{ marginBottom: "250px" }}>
      <div className="mb-8">
        <h1 className="text-[26px] font-light text-text" style={{ fontFamily: "var(--font-heading)" }}>Post a Listing</h1>
        <p className="text-text-secondary text-[13px] mt-1.5">Create a new referral exchange listing. Active for 24 hours.</p>
      </div>

      {existingListing && (
        <div className="mb-5 p-4 rounded-xl bg-bg-card border border-border">
          <p className="text-[12px] text-text-muted">You already have an active listing:</p>
          <p className="text-[13px] text-text mt-1 font-medium">{existingListing.title}</p>
          <button onClick={handleDeleteAndRepost} disabled={loading} className="mt-2 text-red text-[12px] font-medium hover:underline transition-colors">Delete and Repost</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="md:col-span-3">
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <label className="text-[12px] text-text-muted font-medium block mb-3">Select Listing Type</label>
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {LISTING_TITLES.map((title) => (
                <button key={title} onClick={() => setSelectedTitle(title)} className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[13px] transition-colors border ${selectedTitle === title ? "bg-primary-soft text-primary border-primary/30" : "bg-bg-inset text-text border-border hover:bg-bg-hover"}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedTitle === title ? "bg-primary border-primary" : "border-border"}`}>
                      {selectedTitle === title && <Icon name="check" size={10} className="text-white" />}
                    </div>
                    {title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[12px] text-text-muted font-medium">Describe your referral</label>
              <span className="text-[10px] text-text-muted">{message.length}/{MAX_MESSAGE_LENGTH}</span>
            </div>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Tell others about this referral..."
              className="w-full bg-bg-inset text-text text-[13px] rounded-lg p-3 outline-none border transition-colors resize-none h-32 placeholder:text-text-muted focus:border-primary"
              style={{ borderColor: linkError ? "var(--red)" : "var(--border)" }}
            />
            {linkError && <p className="text-red text-[11px] mt-1.5">{linkError}</p>}
          </div>

          <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={profile?.photo_url} name={profile?.display_name} size={32} />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-text truncate">{profile?.display_name || "You"}</p>
                <p className="text-[11px] text-primary truncate">@{profile?.telegram_username || "username"}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedTitle || loading || !!linkError}
              className="px-4 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold disabled:opacity-40 transition-opacity hover:bg-primary-hover flex items-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="plus" size={12} />
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

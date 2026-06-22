"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../../../components/Avatar";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/Toast";
import { LISTING_TITLES, createListing, deactivateListing, getUserActiveListing, updateUser } from "../../../services/database";

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
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Post a <span className="text-[#06B6D4]">Listing</span></h1>
        <p className="text-[#94A3B8] text-[15px] mt-1">Create a new referral exchange listing. Active for 24 hours.</p>
      </div>

      {existingListing && (
        <div className="mb-6 p-4 rounded-xl bg-[#1D1940]/20 border border-[#1D1940]/40">
          <p className="text-[13px] text-[#94A3B8]">You already have an active listing:</p>
          <p className="text-[14px] text-white mt-1 font-medium">{existingListing.title}</p>
          <button onClick={handleDeleteAndRepost} disabled={loading} className="mt-3 text-[#EF4444] text-[13px] font-medium ripple px-3 py-1.5 rounded-lg active:scale-95 transition-transform">Delete and Repost</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-6">
            <label className="text-[13px] text-[#94A3B8] font-medium block mb-3">Select Listing Type</label>
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {LISTING_TITLES.map((title) => (
                <button key={title} onClick={() => setSelectedTitle(title)} className={`ripple w-full text-left px-4 py-3.5 rounded-xl text-[15px] hover:border-[#06B6D4]/40 transition-all duration-200 ${selectedTitle === title ? "bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40" : "bg-[#0D0B1A] text-white hover:bg-[#1D1940]"}`}>{title}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[13px] text-[#94A3B8] font-medium">Describe your referral</label>
              <span className="text-[11px] text-[#94A3B8]">{message.length}/{MAX_MESSAGE_LENGTH}</span>
            </div>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Tell others about this referral — what it does, why it's useful, or anything they should know before contacting you..."
              className="w-full bg-[#0D0B1A] text-white text-[14px] rounded-xl p-3.5 outline-none border transition-colors resize-none h-40 placeholder:text-[#94A3B8] focus:border-[#06B6D4]"
              style={{ borderColor: linkError ? "#EF4444" : "transparent" }}
            />
            {linkError && <p className="text-[#EF4444] text-[12px] mt-1.5">{linkError}</p>}
          </div>

          <div className="bg-[#151230] rounded-xl border border-[#1E1B3A] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={profile?.photo_url} name={profile?.display_name} size={40} />
              <div>
                <p className="text-[14px] font-semibold text-white">{profile?.display_name || "You"}</p>
                <p className="text-[12px] text-[#06B6D4]">@{profile?.telegram_username || "username"}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedTitle || loading || !!linkError}
              className="ripple px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0EA5E9] text-white text-[14px] font-semibold disabled:opacity-40 active:scale-95 transition-all duration-200 hover:shadow-lg hover:shadow-[#06B6D4]/30"
            >
              {loading ? "Posting..." : "Post a Listing"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

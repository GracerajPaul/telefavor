import supabase from "./supabase";

export const LISTING_TITLES = [
  "Telegram Channel Sub Swap",
  "Telegram Group Join Swap",
  "Telegram Bot Referral",
  "Telegram Mini App Invite",
  "Telegram Premium Gift Exchange",
  "Telegram Channel Boost Swap",
  "Telegram Stars Exchange",
  "Telegram Game Score Swap",
  "Telegram Sticker Pack Share",
  "Telegram Contest Join Swap",
  "Telegram Poll Vote Exchange",
  "Telegram Community Referral",
  "TON Tap-to-Earn Invite",
  "TON Wallet Referral",
  "TON NFT Trade Referral",
  "TON Game Referral",
];

// --- USERS ---

export const createUser = async (id, data) => {
  const { error } = await supabase.from("users").insert({
    id,
    google_id: id,
    email: data.email || "",
    display_name: data.display_name || "",
    photo_url: data.photo_url || "",
    telegram_username: data.telegram_username || "",
    trust_score: 0,
    green_ratings: 0,
    red_ratings: 0,
    total_listings_posted: 0,
    contact_taps_received: 0,
    has_onboarded: !!data.telegram_username,
  });
  if (error) throw error;
};

export const getUser = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") return null;
  return data || null;
};

export const updateUser = async (id, updates) => {
  const { error } = await supabase
    .from("users")
    .update({ ...updates, last_active: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
};

// --- LISTINGS ---

export const createListing = async (userId, telegramUsername, title, message = null) => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const { data, error } = await supabase
    .from("listings")
    .insert({
      user_id: userId,
      telegram_username: telegramUsername,
      title,
      message,
      posted_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      contact_taps: 0,
      is_active: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getActiveListings = async () => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("is_active", true)
    .gt("expires_at", now)
    .order("posted_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
};

export const getListing = async (listingId) => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();
  if (error) return null;
  return data;
};

export const deactivateListing = async (listingId) => {
  const { error } = await supabase
    .from("listings")
    .update({ is_active: false })
    .eq("id", listingId);
  if (error) throw error;
};

export const getUserActiveListing = async (userId) => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
};

export const getUserListings = async (userId) => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", userId)
    .order("posted_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

// --- RATINGS ---

export const createRating = async (raterId, ratedUserId, listingId, result) => {
  const { data, error } = await supabase
    .from("ratings")
    .insert({
      rater_id: raterId,
      rated_user_id: ratedUserId,
      listing_id: listingId,
      result,
    })
    .select()
    .single();
  if (error) throw error;

  // Recalculate trust score
  const { data: userRatings } = await supabase
    .from("ratings")
    .select("result")
    .eq("rated_user_id", ratedUserId);

  if (userRatings) {
    const green = userRatings.filter((r) => r.result === "green").length;
    const red = userRatings.filter((r) => r.result === "red").length;
    const total = green + red;
    const newScore = total > 0 ? Math.round((green / total) * 100) : 0;
    await supabase
      .from("users")
      .update({
        green_ratings: green,
        red_ratings: red,
        trust_score: newScore,
        last_active: new Date().toISOString(),
      })
      .eq("id", ratedUserId);
  }

  return data;
};

export const getRating = async (raterId, listingId) => {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("rater_id", raterId)
    .eq("listing_id", listingId)
    .maybeSingle();
  if (error) return null;
  return data;
};

export const updateDescription = async (userId, description) => {
  const { error } = await supabase
    .from("users")
    .update({ description })
    .eq("id", userId);
  if (error) throw error;
};

// --- VERIFICATION ---

export const generateVerificationCode = async (userId, telegramUsername) => {
  const res = await fetch("/api/verification/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, telegramUsername }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to generate code");
  return data;
};

export const checkVerification = async (userId) => {
  const res = await fetch(`/api/verification/status?userId=${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to check");
  return data.verified ? data : null;
};

export const verifyTelegramOwnership = async (code, telegramId, telegramUsername) => {
  const { data: record, error: fetchError } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!record) return { success: false, error: "Invalid code" };
  if (record.verified) return { success: false, error: "Code already used" };
  if (new Date(record.expires_at) < new Date()) return { success: false, error: "Code expired" };

  const username = telegramUsername.replace("@", "").trim().toLowerCase();
  if (record.telegram_username !== username) return { success: false, error: "Username mismatch" };

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("telegram_id", telegramId)
    .maybeSingle();
  if (existing) return { success: false, error: "This Telegram account is already linked to another user" };

  await supabase
    .from("verification_codes")
    .update({ verified: true, telegram_id: telegramId })
    .eq("id", record.id);

  await supabase
    .from("users")
    .update({ telegram_id: telegramId, telegram_verified: true, last_active: new Date().toISOString() })
    .eq("id", record.user_id);

  return { success: true };
};

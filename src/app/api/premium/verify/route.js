import { NextResponse } from "next/server";
import supabase from "../../../../services/supabase";

const PREMIUM_CODE = "171717";

export async function POST(req) {
  try {
    const { userId, code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (code !== PREMIUM_CODE) {
      return NextResponse.json({ success: false, error: "Invalid premium code" });
    }

    if (userId) {
      const { error } = await supabase
        .from("users")
        .update({ premium_verified: true, last_active: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw error;
      return NextResponse.json({ success: true, userId });
    }

    const crypto = await import("crypto");
    const newId = crypto.randomUUID();
    const { error: insertError } = await supabase.from("users").insert({
      id: newId,
      google_id: "",
      email: "",
      display_name: "Premium User",
      photo_url: "",
      telegram_username: "",
      trust_score: 0,
      green_ratings: 0,
      red_ratings: 0,
      total_listings_posted: 0,
      contact_taps_received: 0,
      has_onboarded: true,
      premium_verified: true,
    });
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, userId: newId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

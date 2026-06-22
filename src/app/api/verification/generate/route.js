import { NextResponse } from "next/server";
import supabase from "../../../../services/supabase";

export async function POST(req) {
  try {
    const { userId, telegramUsername } = await req.json();
    if (!userId || !telegramUsername) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const code = "TF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("verification_codes")
      .insert({
        user_id: userId,
        code,
        telegram_username: telegramUsername.replace("@", "").trim().toLowerCase(),
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ code: data.code, expires_at: data.expires_at });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

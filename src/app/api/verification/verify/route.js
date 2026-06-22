import { NextResponse } from "next/server";
import supabase from "../../../../services/supabase";

export async function POST(req) {
  try {
    const { code, telegramId, telegramUsername } = await req.json();
    if (!code || !telegramId || !telegramUsername) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: record, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!record) return NextResponse.json({ success: false, error: "Invalid code" }, { status: 400 });
    if (record.verified) return NextResponse.json({ success: false, error: "Code already used" }, { status: 400 });
    if (new Date(record.expires_at) < new Date()) return NextResponse.json({ success: false, error: "Code expired" }, { status: 400 });

    const username = telegramUsername.replace("@", "").trim().toLowerCase();
    if (record.telegram_username !== username) {
      return NextResponse.json({ success: false, error: "Username mismatch - verification failed" }, { status: 403 });
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: "This Telegram account is already linked to another user" }, { status: 409 });
    }

    await supabase
      .from("verification_codes")
      .update({ verified: true, telegram_id: telegramId })
      .eq("id", record.id);

    await supabase
      .from("users")
      .update({ telegram_id: telegramId, telegram_verified: true, last_active: new Date().toISOString() })
      .eq("id", record.user_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

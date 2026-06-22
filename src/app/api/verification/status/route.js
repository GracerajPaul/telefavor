import { NextResponse } from "next/server";
import supabase from "../../../../services/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("verified", true)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;

    if (data) {
      return NextResponse.json({ verified: true, code: data.code });
    }

    const { data: user } = await supabase
      .from("users")
      .select("telegram_verified")
      .eq("id", userId)
      .single();

    return NextResponse.json({ verified: user?.telegram_verified || false });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

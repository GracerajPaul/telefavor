import { NextResponse } from "next/server";
import supabase from "../../../../services/supabase";

const PREMIUM_CODE = "171717";

export async function POST(req) {
  try {
    const { userId, code } = await req.json();
    if (!userId || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (code !== PREMIUM_CODE) {
      return NextResponse.json({ success: false, error: "Invalid premium code" });
    }

    const { error } = await supabase
      .from("users")
      .update({ premium_verified: true, last_active: new Date().toISOString() })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

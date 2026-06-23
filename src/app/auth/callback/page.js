"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../services/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    supabase.auth.onAuthStateChange((event, session) => {
      if (handled.current) return;
      if (event === "SIGNED_IN" && session) {
        handled.current = true;
        router.replace("/explore");
      } else if (event === "SIGNED_OUT") {
        handled.current = true;
        router.replace("/");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="spinner" />
    </div>
  );
}

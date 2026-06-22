"use client";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import TopNav from "../../components/TopNav";
import BottomNav from "../../components/BottomNav";

export default function MainLayout({ children }) {
  const { isLoggedIn, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirecting = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !redirecting.current) {
      redirecting.current = true;
      router.replace("/");
      return;
    }
    if (profile && !profile.has_onboarded && pathname !== "/onboarding" && !redirecting.current) {
      redirecting.current = true;
      router.replace("/onboarding");
      return;
    }
    if (profile && profile.has_onboarded && !profile.telegram_verified && !profile.premium_verified && pathname !== "/onboarding" && !redirecting.current) {
      redirecting.current = true;
      router.replace("/onboarding?verify=1");
      return;
    }
    redirecting.current = false;
  }, [isLoggedIn, profile, router, pathname]);

  return (
    <div className="min-h-screen bg-[#0D0B1A] bg-grid">
      <TopNav />
      <div className="pt-14 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

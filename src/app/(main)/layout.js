"use client";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import TopNav from "../../components/TopNav";

export default function MainLayout({ children }) {
  const { isAuthenticated, loading, profileLoading, isLoggedIn, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirecting = useRef(false);

  useEffect(() => {
    if (loading || profileLoading) return;
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
    if (profile && profile.has_onboarded && !profile.telegram_verified && pathname !== "/onboarding" && !redirecting.current) {
      redirecting.current = true;
      router.replace("/onboarding?verify=1");
      return;
    }
    redirecting.current = false;
  }, [loading, profileLoading, isLoggedIn, profile, router, pathname]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] bg-grid">
      <TopNav />
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

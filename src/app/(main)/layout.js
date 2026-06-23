"use client";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/Sidebar";
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
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="md:ml-[220px] pb-20 md:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 md:py-10">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

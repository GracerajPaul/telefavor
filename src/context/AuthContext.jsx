"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { onAuthChange, getCurrentSession } from "../services/auth";
import { getUser, createUser } from "../services/database";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const initDone = useRef(false);

  const loadProfile = async (userId) => {
    try {
      let profileData = await getUser(userId);
      if (!profileData) {
        const sbUser = (await getCurrentSession())?.user;
        if (sbUser) {
          try {
            await createUser(userId, {
              email: sbUser.email,
              display_name: sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "User",
              photo_url: sbUser.user_metadata?.avatar_url || "",
            });
          } catch {
            // User may already exist or table not created yet
          }
          profileData = await getUser(userId);
        }
      }
      return profileData;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const session = await getCurrentSession();
        if (session?.user) {
          setUser(session.user);
          const p = await loadProfile(session.user.id);
          setProfile(p);
        }
      } catch {
        // Auth not configured yet
      }
      initDone.current = true;
      setLoading(false);
      setProfileLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const unsub = onAuthChange(async (authUser) => {
      if (!initDone.current) return;
      setUser(authUser);
      if (authUser) {
        const profileData = await loadProfile(authUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });
    return unsub;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        const profileData = await getUser(user.id);
        setProfile(profileData);
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        refreshProfile,
        isAuthenticated: !!user && !!profile?.has_onboarded,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

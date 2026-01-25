"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserPreferences, Language, Currency } from "@/types/user";

interface PreferencesContextProps {
  preferences: Partial<UserPreferences>;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  // Load preferences from Clerk publicMetadata on login
  useEffect(() => {
    if (user) {
      const prefs = user.publicMetadata?.preferences as Partial<UserPreferences> | undefined;
      if (prefs) {
        setPreferences(prefs);
      } else {
        // Fallback: try to get language/currency directly, cast to correct types
        setPreferences({
          language: user.publicMetadata?.language as Language | undefined,
          currency: user.publicMetadata?.currency as Currency | undefined,
        });
      }
    }
  }, [user]);

  const handleSetPreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences(prefs);
    // Optionally persist to backend or Clerk
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences: handleSetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within a PreferencesProvider");
  return ctx;
}

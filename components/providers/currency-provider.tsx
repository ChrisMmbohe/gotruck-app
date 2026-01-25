"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export type Currency = "KES" | "UGX" | "TZS";

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider = ({ children, initialCurrency = "KES" }: { children: React.ReactNode; initialCurrency?: Currency }) => {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);

  const handleSetCurrency = useCallback((cur: Currency) => {
    setCurrency(cur);
    // Optionally persist to localStorage or cookie
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}

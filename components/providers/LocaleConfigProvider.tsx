"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppLocale } from "@/i18n/routing";
import { applyCurrencyToConfig, CURRENCY_COOKIE, type CurrencyCode } from "@/lib/currency";
import type { SystemConfig } from "@/lib/types";

interface LocaleConfigValue {
  config: SystemConfig;
  locale: AppLocale;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const LocaleConfigContext = createContext<LocaleConfigValue | null>(null);

function setCurrencyCookie(code: CurrencyCode) {
  document.cookie = `${CURRENCY_COOKIE}=${code};path=/;max-age=31536000;samesite=lax`;
}

export function LocaleConfigProvider({
  children,
  config: baseConfig,
  locale,
  initialCurrency,
}: {
  children: React.ReactNode;
  config: SystemConfig;
  locale: AppLocale;
  initialCurrency: CurrencyCode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);

  useEffect(() => {
    setCurrencyState(initialCurrency);
  }, [initialCurrency]);

  const config = useMemo(
    () => applyCurrencyToConfig(baseConfig, currency),
    [baseConfig, currency],
  );

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    setCurrencyCookie(code);
  }, []);

  return (
    <LocaleConfigContext.Provider
      value={{ config, locale, currency, setCurrency }}
    >
      {children}
    </LocaleConfigContext.Provider>
  );
}

export function useLocaleConfig() {
  const ctx = useContext(LocaleConfigContext);
  if (!ctx) {
    throw new Error("useLocaleConfig must be used within LocaleConfigProvider");
  }
  return ctx;
}

import { cookies } from "next/headers";
import {
  CURRENCY_COOKIE,
  getInitialCurrency,
  type CurrencyCode,
} from "./currency";
import type { SystemConfig } from "./types";

export { getInitialCurrency };

export async function readPreferredCurrency(
  config: SystemConfig,
): Promise<CurrencyCode> {
  const store = await cookies();
  return getInitialCurrency(store.get(CURRENCY_COOKIE)?.value, config);
}

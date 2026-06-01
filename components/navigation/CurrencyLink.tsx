"use client";

import { Link as BaseLink } from "@/i18n/navigation";
import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";
import { pathWithCurrency } from "@/lib/currency";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof BaseLink>;

export function CurrencyLink({ href, ...props }: Props) {
  const { currency } = useLocaleConfig();
  const resolved =
    typeof href === "string" ? pathWithCurrency(currency, href) : href;
  return <BaseLink href={resolved} {...props} />;
}

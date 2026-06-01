import { unstable_cache } from "next/cache";
import type { AppLocale } from "@/i18n/routing";
import { toApiContentLanguage } from "@/i18n/api-locale";
import { apiConfig } from "./config";
import type { ApiResponse, SystemConfig } from "./types";

const CONFIG_PATH = "/api/index/config";

async function fetchSystemConfigRaw(
  contentLanguage: string,
): Promise<SystemConfig | null> {
  const base = apiConfig.baseUrl.replace(/\/$/, "");
  const headers: HeadersInit = {
    accept: "*/*",
    "api-version": apiConfig.apiVersion,
    "content-type": "application/json",
    "content-language": contentLanguage,
    platform: apiConfig.platform,
    ...(apiConfig.bearerToken
      ? { authorization: `Bearer ${apiConfig.bearerToken}` }
      : {}),
  };

  try {
    const res = await fetch(`${base}${CONFIG_PATH}`, {
      method: "POST",
      headers,
      body: "{}",
      next: { revalidate: apiConfig.revalidateSeconds },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiResponse<SystemConfig>;
    if (json.code !== 200 || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

const defaultConfig: SystemConfig = {
  invite_domain: "",
  login_captcha: "0",
  register_captcha: "0",
  chat_domain: "",
  video_domain: "",
  currency: [],
  service_url: "",
  app_download_url: process.env.NEXT_PUBLIC_PLATFORM_URL ?? "",
  service_open_type: "2",
  video_watch_limit: "",
  aws_access_domain:
    process.env.NEXT_PUBLIC_CDN_URL ?? apiConfig.baseUrl,
  currency_code: "PKR",
  currency_symbol: "₨",
  wtdCheckPhone: 1,
  languageType: {
    defaultLanguage: "en_US",
    list: [],
  },
  loadLoginAndRegWay: {
    login: "",
    register: "",
    defLogin: "",
    defRegister: "",
    merchantsId: null,
    authType: null,
  },
  notice_interval_set: [],
  app_call_h5_domain: process.env.NEXT_PUBLIC_PLATFORM_URL ?? "",
};

export async function getSystemConfig(
  locale: AppLocale,
): Promise<SystemConfig> {
  const contentLanguage = toApiContentLanguage(locale);

  const cached = unstable_cache(
    async () => fetchSystemConfigRaw(contentLanguage),
    ["system-config", contentLanguage],
    { revalidate: apiConfig.revalidateSeconds },
  );

  return (await cached()) ?? defaultConfig;
}

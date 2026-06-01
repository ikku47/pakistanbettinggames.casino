export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  info: unknown;
}

export interface CurrencyConfig {
  currencyId: string;
  currencyName: string;
  isDefault: string;
  isFundPwdOpen: string;
}

export interface LanguageTypeItem {
  dictLabel: string;
  dictValue: string;
  dictSort: number;
}

export interface LanguageType {
  defaultLanguage: string;
  list: LanguageTypeItem[];
}

export interface LoadLoginAndRegWay {
  login: string;
  register: string;
  defLogin: string;
  defRegister: string;
  merchantsId: string | null;
  authType: string | null;
}

export interface NoticeIntervalSet {
  interval: number;
  dictKey: string;
}

/** Subset of `/api/index/config` used by this site. */
export interface SystemConfig {
  invite_domain: string;
  login_captcha: string;
  register_captcha: string;
  chat_domain: string;
  video_domain: string;
  currency: CurrencyConfig[];
  service_url: string;
  app_download_url: string;
  service_open_type: string;
  video_watch_limit: string;
  aws_access_domain: string;
  currency_code: string;
  currency_symbol: string;
  wtdCheckPhone: 1 | 2;
  languageType: LanguageType;
  loadLoginAndRegWay: LoadLoginAndRegWay;
  notice_interval_set: NoticeIntervalSet[];
  app_call_h5_domain?: string;
}

export interface GameRecord {
  id: number;
  gameClassCode: string;
  gameCode: string;
  gameName: string;
  platformId: number;
  platIcon: string;
  isAegis: number;
  iconUrl: string;
  gameType: number;
  isSavour: number;
  vipLevelLimit: number;
  rechargeAmountLimit: number;
  userBalanceLimit: number;
}

export interface PlatformRecord {
  platformId: number;
  platformName: string;
  platformCode: string;
  gameClassCode: string;
  icon: string;
  picture: string;
  isAegis: number;
  isGame: number;
  gameType: number;
}

export interface GameClass {
  code: string;
  name: string;
  classIcon: {
    checked: string;
    unchecked: string;
  };
  gameType: number;
  isGame: number;
  plats: PlatformRecord[] | null;
  games: GameRecord[] | null;
}

export interface GameListPage {
  records: GameRecord[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface CategoryDef {
  code: string;
  slug: string;
  messageKey: string;
}

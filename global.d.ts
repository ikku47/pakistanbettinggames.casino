import type en from "./messages/en-PK.json";

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}

export {};

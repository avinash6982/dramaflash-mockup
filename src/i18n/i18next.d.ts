import type { en } from "./en";

// Makes t("...") check keys against en.ts
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}

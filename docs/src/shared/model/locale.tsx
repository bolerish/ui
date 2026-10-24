import { createContext, useContext, type ReactNode } from "react";

export type Locale = "ko" | "en";
export const LocaleContext = createContext<Locale>("en");
export const useLocale = () => useContext(LocaleContext);

export function LocaleContent({ children, locale }: { children: ReactNode; locale: Locale }) {
  return useLocale() === locale ? children : null;
}

export const ui = {
  preview: "Preview",
  code: "Code",
  viewExample: "Example view",
  copy: "Copy code",
  copied: "Code copied.",
  copyFailed: "Could not copy. Select the code and copy it manually.",
  missing: "Example not found. Refresh the page to try again.",
  onThisPage: "On this page",
  language: "Language",
  colorMode: "Color mode",
  light: "Light",
  dark: "Dark",
  motion: "Motion",
  system: "System",
  reduce: "Reduce motion",
  allowMotion: "Allow motion",
  documentError: "Could not display this page. Refresh the page to try again.",
} as const;

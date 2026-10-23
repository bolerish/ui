import { createContext, useContext } from "react";

import { validateSettings, type DocumentationGlobals } from "./settings";
export type { DocumentationGlobals } from "./settings";
export const DocumentationContext = createContext<DocumentationGlobals>(validateSettings({}));
export function useDocumentationGlobals() {
  return useContext(DocumentationContext);
}

export const DocumentationPreferencesContext = createContext<
  (changes: Partial<DocumentationGlobals>) => void
>(() => {});
export function useDocumentationPreferences() {
  return useContext(DocumentationPreferencesContext);
}

import { useSyncExternalStore } from "react";

const key = "bolerish-preview-tabs";
const event = "bolerish-preview-tab-change";
const fallback = new Map<string, "preview" | "code">();
function read(name: string): "preview" | "code" {
  if (fallback.has(name)) return fallback.get(name)!;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}")[name] === "code" ? "code" : "preview";
  } catch {
    return fallback.get(name) ?? "preview";
  }
}
function subscribe(listener: () => void) {
  window.addEventListener(event, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(event, listener);
    window.removeEventListener("storage", listener);
  };
}
export function usePreviewTab(name: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(name),
    () => "preview" as const,
  );
  function select(value: unknown) {
    if (value !== "preview" && value !== "code") return;
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "{}");
      localStorage.setItem(key, JSON.stringify({ ...saved, [name]: value }));
      fallback.delete(name);
    } catch {
      fallback.set(name, value);
    }
    window.dispatchEvent(new Event(event));
  }
  return { value, select };
}

// Both panels are pre-rendered. Restore the visual choice before hydration without changing React's DOM.
export const previewTabBootstrap = `(()=>{function apply(){try{const saved=JSON.parse(localStorage.getItem('bolerish-preview-tabs')||'{}');let style=document.getElementById('preview-tab-state');if(!style){style=document.createElement('style');style.id='preview-tab-state';document.head.appendChild(style)}style.textContent=Object.entries(saved).filter(([,value])=>value==='code').map(([name])=>{const root='[data-preview-name="'+CSS.escape(name)+'"]';return root+' [data-preview-panel="preview"]{display:none!important}'+root+' [data-preview-panel="code"]{display:block!important}'+root+' [data-preview-trigger="preview"]{background-color:transparent!important;box-shadow:none!important;color:var(--docs-muted)!important}'+root+' [data-preview-trigger="code"]{background-color:var(--docs-preview-tab-selected)!important;color:var(--docs-foreground)!important;box-shadow:inset 0 0 0 1px var(--docs-border)!important}'}).join('')}catch{}}apply();window.addEventListener('bolerish-preview-tab-change',apply);window.addEventListener('storage',apply)})()`;

import { useSyncExternalStore } from "react";

export const sources = import.meta.glob<string>("../drafts/*.json", {
  query: "?raw",
  import: "default",
  eager: true,
});

type DraftStore = { sources: Record<string, string>; listeners: Set<() => void> };
const store: DraftStore = import.meta.hot?.data.store ?? { sources, listeners: new Set() };

if (import.meta.hot) {
  import.meta.hot.data.store = store;
  import.meta.hot.accept((next) => {
    if (!next) return;
    store.sources = next.sources;
    for (const listener of store.listeners) listener();
  });
}

function subscribe(listener: () => void) {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function useDraftSources() {
  return useSyncExternalStore(subscribe, () => store.sources);
}

import { createRoot } from "react-dom/client";

const { default: App } = new URLSearchParams(location.search).has("canvas")
  ? await import("./Canvas")
  : await import("./Shell");

createRoot(document.getElementById("root")!).render(<App />);

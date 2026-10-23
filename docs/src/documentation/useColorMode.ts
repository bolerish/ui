import { useEffect, useState } from "react";

export function useColorMode(preference: "system" | "light" | "dark") {
  const [systemDark, setSystemDark] = useState(() => false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  if (preference === "system") return systemDark ? "dark" : "light";
  return preference;
}

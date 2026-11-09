import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Skeleton } from "@bolerish/ui/skeleton";

export default function Default() {
  return (
    <div style={{ display: "grid", gap: spacingVars.space3, width: "100%", maxWidth: "24rem" }}>
      <Skeleton style={{ height: "1rem", width: "45%" }} />
      <Skeleton style={{ height: "2.25rem" }} />
    </div>
  );
}

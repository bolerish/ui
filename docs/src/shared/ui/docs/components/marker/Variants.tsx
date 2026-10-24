import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Marker, MarkerContent, MarkerIcon } from "@bolerish/ui/marker";
import { Spinner } from "@bolerish/ui/spinner";
import { GitBranchIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
const layout = stylex.create({
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    width: "100%",
  },
  column: {
    alignItems: "stretch",
    flexDirection: "column",
  },
});
export default function Variants() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <Marker>
        <MarkerIcon>
          <Spinner label="Writing a reply" />
        </MarkerIcon>
        <MarkerContent>Writing a reply.</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Started a new task flow.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Unread messages</MarkerContent>
      </Marker>
    </div>
  );
}

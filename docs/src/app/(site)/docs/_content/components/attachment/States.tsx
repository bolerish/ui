import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@bolerish/ui/attachment";
import { DownloadSimpleIcon, FileIcon, XIcon } from "@phosphor-icons/react";
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
  componentWidth: {
    maxWidth: "28rem",
    width: "100%",
  },
});
function FileAttachment({ error = false }: { error?: boolean }) {
  return (
    <Attachment state={error ? "error" : "done"}>
      <AttachmentMedia>
        <FileIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>project-proposal.pdf</AttachmentTitle>
        <AttachmentDescription>
          {error ? "Couldn’t upload the file. Try again." : "2.4 MB · Uploaded"}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Download file">
          <DownloadSimpleIcon />
        </AttachmentAction>
        <AttachmentAction aria-label="Remove attachment">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}
export default function States() {
  return (
    <div {...stylex.props(layout.preview, [layout.column, layout.componentWidth])}>
      <FileAttachment />
      <FileAttachment error />
    </div>
  );
}

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@bolerish/ui/attachment";
import { PaperclipIcon } from "@phosphor-icons/react";
export default function Default() {
  return (
    <Attachment>
      <AttachmentMedia>
        <PaperclipIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>meeting-notes.txt</AttachmentTitle>
        <AttachmentDescription>18 KB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  );
}

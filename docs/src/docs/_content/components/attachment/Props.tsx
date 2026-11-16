import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
} from "@bolerish/ui/attachment";
import { PaperclipIcon } from "@phosphor-icons/react";

export const propExamples = {
  orientation: {
    horizontal: (
      <Attachment orientation="horizontal">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    vertical: (
      <Attachment orientation="vertical">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
  },
  size: {
    xs: (
      <Attachment size="xs">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    sm: (
      <Attachment size="sm">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    default: (
      <Attachment size="default">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
  },
  state: {
    idle: (
      <Attachment state="idle">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    uploading: (
      <Attachment state="uploading">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    processing: (
      <Attachment state="processing">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    done: (
      <Attachment state="done">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
    error: (
      <Attachment state="error">
        <AttachmentMedia>
          <PaperclipIcon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes.txt</AttachmentTitle>
          <AttachmentDescription>18 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["orientation"]["horizontal"]
    /* @example-end */
  );
}

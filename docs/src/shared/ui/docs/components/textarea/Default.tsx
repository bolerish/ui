import { Textarea } from "@bolerish/ui/textarea";
export default function Default() {
  return (
    <>
      <Textarea aria-label="Note" placeholder="Write down the decisions from the meeting." />
      <Textarea
        aria-label="Unavailable note"
        disabled
        defaultValue="This note has been reviewed."
      />
    </>
  );
}

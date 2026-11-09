import { Button } from "@bolerish/ui/button";

export default function Variants() {
  return (
    <>
      <Button>Save</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Close</Button>
      <Button variant="destructive">Delete</Button>
    </>
  );
}

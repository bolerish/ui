import { Progress } from "@bolerish/ui/progress";
export default function Default() {
  return (
    <>
      <Progress aria-label="File upload progress" value={64} />
      <Progress aria-label="In progress" value={null} />
    </>
  );
}
